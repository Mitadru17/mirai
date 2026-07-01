/**
 * Progress Store
 *
 * The reactive home for learning progress. Hydrates from SQLite once at startup,
 * then keeps an in-memory mirror that screens subscribe to. Mutations write
 * through to the database and re-read the affected rows so in-memory timestamps
 * always match the SQLite format (keeping ordering logic consistent).
 *
 * Screens should consume the derived `useLearning()` snapshot rather than raw
 * rows — all view-model logic lives in ./learningSelectors.
 */

import { useMemo } from 'react';
import { create } from 'zustand';
import {
  getAllLessonProgress,
  markLessonStarted,
  markLessonCompleted,
  recordStudy,
  getStreakRows,
  type LessonProgressRow,
  type StreakRow,
} from '../services/progressService';
import {
  getCurrentLessonRef,
  getAllModuleProgress,
  getOverallPercent,
  getCompletedLessonCount,
  getGardenStats,
  getDailyStats,
  getCurrentStreak,
  getMinutesToday,
  getStudyTotals,
  getWeeklyActivity,
  getWeakestModule,
  getMasteredModules,
  getReviewLessons,
  getLessonsCompletedToday,
  getLessonProgressFraction,
  type ProgressState,
} from './learningSelectors';
import { TOTAL_LESSONS } from '../curriculum';

interface CompleteArgs {
  quizCorrect: number;
  quizTotal: number;
  minutes: number;
}

interface ProgressStore extends ProgressState {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  startLesson: (lessonId: string, moduleId: string) => Promise<void>;
  completeLesson: (lessonId: string, moduleId: string, args: CompleteArgs) => Promise<void>;
}

function indexByLesson(rows: LessonProgressRow[]): Record<string, LessonProgressRow> {
  const map: Record<string, LessonProgressRow> = {};
  for (const r of rows) map[r.lesson_id] = r;
  return map;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progressByLesson: {},
  streakRows: [],
  hydrated: false,

  hydrate: async () => {
    const [rows, streaks] = await Promise.all([getAllLessonProgress(), getStreakRows()]);
    set({ progressByLesson: indexByLesson(rows), streakRows: streaks, hydrated: true });
  },

  startLesson: async (lessonId, moduleId) => {
    await markLessonStarted(lessonId, moduleId);
    const rows = await getAllLessonProgress();
    set({ progressByLesson: indexByLesson(rows) });
  },

  completeLesson: async (lessonId, moduleId, { quizCorrect, quizTotal, minutes }) => {
    const alreadyDone = get().progressByLesson[lessonId]?.status === 'completed';
    await markLessonCompleted(lessonId, moduleId, quizCorrect, quizTotal);
    // Only count a lesson toward the daily "completed" tally the first time.
    await recordStudy(minutes, alreadyDone ? 0 : 1);
    const [rows, streaks] = await Promise.all([getAllLessonProgress(), getStreakRows()]);
    set({ progressByLesson: indexByLesson(rows), streakRows: streaks });
  },
}));

/** Convenience: hydrate from outside React (e.g. app bootstrap). */
export function hydrateProgress(): Promise<void> {
  return useProgressStore.getState().hydrate();
}

// ─── Derived snapshot hook ──────────────────────────────────────────────────

export interface LearningSnapshot {
  hydrated: boolean;
  currentLessonRef: ReturnType<typeof getCurrentLessonRef>;
  modules: ReturnType<typeof getAllModuleProgress>;
  overallPercent: number;
  completedLessons: number;
  totalLessons: number;
  garden: ReturnType<typeof getGardenStats>;
  dailyStats: ReturnType<typeof getDailyStats>;
  currentStreak: number;
  minutesToday: number;
  studyTotals: ReturnType<typeof getStudyTotals>;
  weeklyActivity: ReturnType<typeof getWeeklyActivity>;
  weakestModule: ReturnType<typeof getWeakestModule>;
  masteredModules: ReturnType<typeof getMasteredModules>;
  reviewLessons: ReturnType<typeof getReviewLessons>;
  lessonsCompletedToday: number;
  lessonFraction: (lessonId: string) => number;
}

/**
 * The single hook every screen uses. Selects the raw state slices and memoises
 * the full derived view-model, so components re-render only when progress or
 * streaks actually change.
 */
export function useLearning(): LearningSnapshot {
  const progressByLesson = useProgressStore((s) => s.progressByLesson);
  const streakRows = useProgressStore((s) => s.streakRows);
  const hydrated = useProgressStore((s) => s.hydrated);

  return useMemo(() => {
    const state: ProgressState = { progressByLesson, streakRows };
    return {
      hydrated,
      currentLessonRef: getCurrentLessonRef(state),
      modules: getAllModuleProgress(state),
      overallPercent: getOverallPercent(state),
      completedLessons: getCompletedLessonCount(state),
      totalLessons: TOTAL_LESSONS,
      garden: getGardenStats(state),
      dailyStats: getDailyStats(state),
      currentStreak: getCurrentStreak(state),
      minutesToday: getMinutesToday(state),
      studyTotals: getStudyTotals(state),
      weeklyActivity: getWeeklyActivity(state),
      weakestModule: getWeakestModule(state),
      masteredModules: getMasteredModules(state),
      reviewLessons: getReviewLessons(state),
      lessonsCompletedToday: getLessonsCompletedToday(state),
      lessonFraction: (lessonId: string) => getLessonProgressFraction(state, lessonId),
    };
  }, [progressByLesson, streakRows, hydrated]);
}
