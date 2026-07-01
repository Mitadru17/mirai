/**
 * Rotating Content Service
 * Manages rotating messages, insights, and quotes.
 * Uses in-memory storage with date-based rotation.
 */

export const GREETING_MESSAGES = [
  'Your future grows today.',
  'One small step is enough.',
  "Let's continue.",
  'Welcome back.',
  'Focus creates growth.',
] as const;

export const INSIGHTS = [
  'You studied 5 days this week.',
  'Arrays are becoming one of your strongest topics.',
  'Only one review remains.',
  "You're on a 12-day streak!",
  '3 topics mastered this month.',
] as const;

export const QUOTES = [
  'The future is built quietly.',
  'Growth happens one day at a time.',
  'Consistency compounds.',
  'Nature does not hurry, yet everything is accomplished.',
  'Focus creates growth.',
] as const;

/**
 * Get index based on current date to rotate content daily.
 */
function getDailyIndex(arrayLength: number, offset: number = 0): number {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return (dayOfYear + offset) % arrayLength;
}

export function getGreetingMessage(): string {
  const index = getDailyIndex(GREETING_MESSAGES.length, 0);
  return GREETING_MESSAGES[index];
}

export function getInsight(): string {
  const index = getDailyIndex(INSIGHTS.length, 1);
  return INSIGHTS[index];
}

export function getQuote(): string {
  const index = getDailyIndex(QUOTES.length, 2);
  return QUOTES[index];
}
