import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useData } from '@/lib/context/data-context';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function SummaryScreen() {
  const colors = useColors();
  const { dataService } = useData();
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    const existingSummary = dataService.getDailySummaryByDate(today);
    if (existingSummary) {
      setSummary(existingSummary);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    setError('');

    try {
      const activities = dataService.getActivitiesByDate(today);
      const habits = dataService.getAllHabits();
      const workouts = dataService.getWorkoutsByDate(today);
      const meals = dataService.getMealsByDate(today);
      const goals = dataService.getAllGoals();
      const checkIns = dataService.getCheckInsByDate(today);

      const habitsCompleted = habits.filter(h => dataService.isHabitCompletedOnDate(h.id, today)).length;
      const habitsMissed = habits.length - habitsCompleted;
      const totalWorkoutDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
      const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

      // Call the backend API to generate summary using LLM
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          activitiesCount: activities.length,
          habitsCompleted,
          habitsMissed,
          workoutSummary: `${workouts.length} workouts, ${totalWorkoutDuration} minutes total`,
          mealSummary: `${meals.length} meals, ${totalCalories} calories`,
          goals: goals.filter(g => g.status !== 'completed').length,
          checkIns: checkIns.length > 0 ? checkIns[0] : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      const newSummary = {
        date: today,
        activitiesCompleted: activities.length,
        habitsCompleted,
        habitsMissed,
        workoutSummary: `${workouts.length} workouts, ${totalWorkoutDuration} minutes`,
        mealSummary: `${meals.length} meals logged`,
        goalProgress: `${goals.filter(g => g.status !== 'completed').length} active goals`,
        productivityOverview: data.productivityOverview || 'Great work today!',
        encouragingObservation: data.encouragingObservation || 'You\'re making progress!',
        suggestions: data.suggestions || [
          'Keep up the momentum tomorrow',
          'Stay hydrated throughout the day',
          'Get enough rest tonight',
        ],
      };

      await dataService.addDailySummary(newSummary);
      setSummary(newSummary);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Failed to generate summary:', err);
      setError('Failed to generate summary. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 gap-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <View className="gap-1">
              <Text className="text-3xl font-bold text-foreground">AI Daily Summary</Text>
              <Text className="text-sm text-muted">Your personalized insights</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Summary Content */}
          {summary ? (
            <View className="gap-4">
              {/* Activities Completed */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Activities Completed</Text>
                <Text className="text-2xl font-bold text-foreground">{summary.activitiesCompleted}</Text>
                <Text className="text-xs text-muted">activities logged today</Text>
              </View>

              {/* Habits */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Habits</Text>
                <View className="flex-row gap-4">
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-success">{summary.habitsCompleted}</Text>
                    <Text className="text-xs text-muted">completed</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-2xl font-bold text-warning">{summary.habitsMissed}</Text>
                    <Text className="text-xs text-muted">missed</Text>
                  </View>
                </View>
              </View>

              {/* Workouts */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Workouts</Text>
                <Text className="text-base text-foreground">{summary.workoutSummary}</Text>
              </View>

              {/* Meals */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Nutrition</Text>
                <Text className="text-base text-foreground">{summary.mealSummary}</Text>
              </View>

              {/* Goals */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Goals</Text>
                <Text className="text-base text-foreground">{summary.goalProgress}</Text>
              </View>

              {/* Productivity Overview */}
              <View className="bg-surface rounded-2xl p-4 gap-2 border border-border">
                <Text className="text-sm font-semibold text-primary">Productivity</Text>
                <Text className="text-base text-foreground">{summary.productivityOverview}</Text>
              </View>

              {/* Encouraging Observation */}
              <View className="bg-success/10 rounded-2xl p-4 gap-2 border border-success">
                <Text className="text-sm font-semibold text-success">💡 Observation</Text>
                <Text className="text-base text-foreground">{summary.encouragingObservation}</Text>
              </View>

              {/* Suggestions */}
              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground">Tomorrow's Suggestions</Text>
                {summary.suggestions.map((suggestion: string, index: number) => (
                  <View key={index} className="bg-surface rounded-lg p-3 border border-border flex-row gap-3">
                    <Text className="text-primary font-bold">{index + 1}.</Text>
                    <Text className="flex-1 text-sm text-foreground">{suggestion}</Text>
                  </View>
                ))}
              </View>

              {/* Regenerate Button */}
              <TouchableOpacity
                onPress={generateSummary}
                disabled={loading}
                className="bg-primary rounded-lg py-4 items-center mt-4"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold">Regenerate Summary</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center gap-4">
              {error ? (
                <>
                  <Text className="text-error font-semibold">{error}</Text>
                  <TouchableOpacity
                    onPress={generateSummary}
                    disabled={loading}
                    className="bg-primary rounded-lg px-6 py-3"
                  >
                    <Text className="text-white font-semibold">Try Again</Text>
                  </TouchableOpacity>
                </>
              ) : loading ? (
                <>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text className="text-muted">Generating your summary...</Text>
                </>
              ) : (
                <>
                  <Text className="text-muted text-center">
                    No summary yet. Generate one to see your daily insights!
                  </Text>
                  <TouchableOpacity
                    onPress={generateSummary}
                    className="bg-primary rounded-lg px-6 py-3"
                  >
                    <Text className="text-white font-semibold">Generate Summary</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
