/**
 * Mirai Home Data Service
 * Mock data provider — will be replaced with SQLite queries in the future.
 */

import type { HomeData, CurrentLesson, DailyTask, DailyStats, ReviewItem, GardenData } from '../types';

export function getCurrentLesson(): CurrentLesson {
  return {
    name: 'Array Fundamentals',
    topic: 'Arrays & Strings',
    progress: 0.65,
    timeRemaining: 12,
  };
}

export function getDailyTasks(): DailyTask[] {
  return [
    { id: 'task-1', title: 'Review yesterday', completed: true },
    { id: 'task-2', title: "Learn today's lesson", completed: false },
    { id: 'task-3', title: 'Solve one practice problem', completed: false },
  ];
}

export function getDailyStats(): DailyStats {
  return {
    completionPercentage: 65,
    minutesToday: 28,
    currentStreak: 12,
  };
}

export function getReviews(): ReviewItem[] {
  // Return empty array to hide review card initially
  // Change to populated array to show review card
  return [
    { topic: 'Binary Search Trees', estimatedMinutes: 8 },
  ];
}

export function getGardenData(): GardenData {
  return {
    health: 87,
    plantType: 'Oak Seedling',
    growth: 42,
  };
}

export function getHomeData(): HomeData {
  return {
    currentLesson: getCurrentLesson(),
    dailyTasks: getDailyTasks(),
    dailyStats: getDailyStats(),
    reviews: getReviews(),
    garden: getGardenData(),
  };
}
