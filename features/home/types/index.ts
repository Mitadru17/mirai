/**
 * Mirai Home Feature — Type Definitions
 */

export interface CurrentLesson {
  name: string;
  topic: string;
  progress: number; // 0-1
  timeRemaining: number; // minutes
}

export interface DailyTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DailyStats {
  completionPercentage: number; // 0-100
  minutesToday: number;
  currentStreak: number;
}

export interface ReviewItem {
  topic: string;
  estimatedMinutes: number;
}

export interface GardenData {
  health: number; // 0-100
  plantType: string;
  growth: number; // 0-100
}

export interface HomeData {
  currentLesson: CurrentLesson;
  dailyTasks: DailyTask[];
  dailyStats: DailyStats;
  reviews: ReviewItem[];
  garden: GardenData;
}
