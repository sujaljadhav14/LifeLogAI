import { describe, it, expect, beforeAll } from 'vitest';

describe('Groq API Integration', () => {
  it('should have GROQ_API_KEY environment variable', () => {
    expect(process.env.GROQ_API_KEY).toBeDefined();
    expect(process.env.GROQ_API_KEY).toMatch(/^gsk_/);
  });

  it('should validate Groq API key format', () => {
    const apiKey = process.env.GROQ_API_KEY;
    expect(apiKey).toMatch(/^gsk_[a-zA-Z0-9_]+$/);
  });
});
