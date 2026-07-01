import { router, publicProcedure } from '../_core/trpc';
import { z } from 'zod';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const groqRouter = router({
  generateSummary: publicProcedure
    .input(
      z.object({
        activitiesCount: z.number(),
        habitsCompleted: z.number(),
        habitsMissed: z.number(),
        workoutSummary: z.string(),
        mealSummary: z.string(),
        goals: z.number(),
        mood: z.string().optional(),
        energy: z.number().optional(),
        sleep: z.number().optional(),
        mainFocus: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
      }

      const prompt = `You are a personal life coach providing a concise, encouraging daily summary. Based on the user's data, generate a personalized response with:
1. A brief productivity overview (1-2 sentences)
2. One encouraging observation about their day
3. Three practical suggestions for tomorrow

User's Daily Data:
- Activities logged: ${input.activitiesCount}
- Habits completed: ${input.habitsCompleted} / (${input.habitsCompleted + input.habitsMissed} total)
- Workouts: ${input.workoutSummary}
- Meals: ${input.mealSummary}
- Active goals: ${input.goals}
${input.mood ? `- Mood: ${input.mood}` : ''}
${input.energy ? `- Energy level: ${input.energy}/10` : ''}
${input.sleep ? `- Sleep duration: ${input.sleep} hours` : ''}
${input.mainFocus ? `- Main focus: ${input.mainFocus}` : ''}
${input.notes ? `- Notes: ${input.notes}` : ''}

Please keep the response concise, motivating, and actionable. Format as:
PRODUCTIVITY: [overview]
OBSERVATION: [encouraging note]
SUGGESTIONS:
1. [suggestion 1]
2. [suggestion 2]
3. [suggestion 3]`;

      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Groq API error:', error);
          throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';

        // Parse the response
        const productivityMatch = content.match(/PRODUCTIVITY:\s*(.+?)(?=OBSERVATION:|$)/s);
        const observationMatch = content.match(/OBSERVATION:\s*(.+?)(?=SUGGESTIONS:|$)/s);
        const suggestionsMatch = content.match(/SUGGESTIONS:\s*([\s\S]+?)$/);

        const productivityOverview = productivityMatch ? productivityMatch[1].trim() : 'Great work today!';
        const encouragingObservation = observationMatch ? observationMatch[1].trim() : 'You\'re making progress!';

        let suggestions = [
          'Keep up the momentum tomorrow',
          'Stay hydrated throughout the day',
          'Get enough rest tonight',
        ];

        if (suggestionsMatch) {
          const suggestionText = suggestionsMatch[1];
          suggestions = suggestionText
            .split('\n')
            .filter((line: string) => line.trim())
            .map((line: string) => line.replace(/^\d+\.\s*/, '').trim())
            .filter((line: string) => line.length > 0)
            .slice(0, 3);
        }

        return {
          productivityOverview,
          encouragingObservation,
          suggestions,
        };
      } catch (error) {
        console.error('Error calling Groq API:', error);
        throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }),

  testConnection: publicProcedure.query(async () => {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'user',
              content: 'Say "Connection successful" in one sentence.',
            },
          ],
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.choices[0]?.message?.content || 'Connected',
      };
    } catch (error) {
      console.error('Groq connection test failed:', error);
      throw new Error(`Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }),
});
