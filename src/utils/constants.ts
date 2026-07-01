/**
 * Mirai Shared Constants
 */

export const APP_NAME        = 'Mirai';
export const APP_VERSION     = '0.1.0';
export const APP_TAGLINE     = 'Your future grows quietly.';
export const APP_DESCRIPTION = 'Master Data Structures & Algorithms through consistency.';

export const TABS = {
  HOME:     'index',
  JOURNEY:  'journey',
  PRACTICE: 'practice',
  JOURNAL:  'journal',
  PROFILE:  'profile',
} as const;

export const DSA_TOPICS = [
  'Arrays', 'Linked Lists', 'Stacks', 'Queues',
  'Hash Tables', 'Trees', 'Graphs', 'Sorting',
  'Searching', 'Recursion', 'Dynamic Programming',
] as const;

export const STREAK_MESSAGES = [
  { min: 0,   message: 'Start your journey today.' },
  { min: 1,   message: 'A quiet start.' },
  { min: 3,   message: 'Momentum is building.' },
  { min: 7,   message: 'One week. Well done.' },
  { min: 14,  message: 'Two weeks of quiet effort.' },
  { min: 30,  message: 'A full month. Remarkable.' },
  { min: 60,  message: 'Sixty days. This is who you are.' },
  { min: 100, message: 'One hundred days of growth.' },
] as const;

export function getStreakMessage(streak: number): string {
  const match = [...STREAK_MESSAGES].reverse().find((m) => streak >= m.min);
  return match?.message ?? 'Start your journey today.';
}
