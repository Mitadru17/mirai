/**
 * Learning Selectors
 *
 * Pure functions that fold raw persisted progress together with the static
 * curriculum to produce everything the UI shows: the current lesson, per-module
 * progress, streaks, garden health, daily stats, weakest topic, and so on.
 *
 * No React, no side effects — just curriculum + progress in, view-model out.
 * The store wraps these; screens never recompute this logic themselves.
 */

import {
  CURRICULUM,
  LESSON_REFS,
  getModule,
  getLessonRef,
  countQuizzes,
  moduleDuration,
  type Module,
  type LessonRef,
} from '../curriculum';
import type { LessonProgressRow, LessonStatus, StreakRow } from '../services/progressService';

// ─── Tunables ───────────────────────────────────────────────────────────────

/** Daily study target used for the "today" completion ring, in minutes. */
export const DAILY_GOAL_MINUTES = 20;
/** A completed lesson older than this many days is considered due for review. */
export const REVIEW_AGE_DAYS = 3;

// ─── Raw state shape ────────────────────────────────────────────────────────

export interface ProgressState {
  progressByLesson: Record<string, LessonProgressRow>;
  streakRows: StreakRow[];
}

export interface ModuleProgress {
  module: Module;
  completedLessons: number;
  totalLessons: number;
  percent: number; // 0–100
  status: 'completed' | 'in_progress' | 'not_started' | 'locked';
  unlocked: boolean;
  durationMinutes: number;
}

// ─── Date helpers (string-based, engine-safe) ───────────────────────────────
// SQLite stores timestamps as 'YYYY-MM-DD HH:MM:SS' (UTC). ISO date strings
// compare correctly lexicographically, so we compare date prefixes rather than
// parsing, which is unreliable on Hermes.

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgoStr(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return toDateStr(d);
}

function datePrefix(ts: string | null): string | null {
  return ts ? ts.slice(0, 10) : null;
}

// ─── Lesson-level ───────────────────────────────────────────────────────────

export function lessonStatus(state: ProgressState, lessonId: string): LessonStatus {
  return state.progressByLesson[lessonId]?.status ?? 'not_started';
}

export function getCompletedLessonCount(state: ProgressState): number {
  return Object.values(state.progressByLesson).filter((r) => r.status === 'completed').length;
}

export function getInProgressLessonCount(state: ProgressState): number {
  return Object.values(state.progressByLesson).filter((r) => r.status === 'in_progress').length;
}

/** Completed lessons whose completion is older than the review threshold. */
export function getReviewDueCount(state: ProgressState): number {
  return getReviewLessons(state).length;
}

/**
 * Completed lessons now due for review, oldest completion first — so the most
 * "stale" knowledge surfaces first.
 */
export function getReviewLessons(state: ProgressState): LessonRef[] {
  const cutoff = daysAgoStr(REVIEW_AGE_DAYS);
  return Object.values(state.progressByLesson)
    .filter((r) => {
      if (r.status !== 'completed') return false;
      const d = datePrefix(r.completed_at);
      return d != null && d <= cutoff;
    })
    .sort((a, b) => (a.completed_at ?? '').localeCompare(b.completed_at ?? ''))
    .map((r) => getLessonRef(r.lesson_id))
    .filter((ref): ref is LessonRef => ref != null);
}

/** Number of lessons completed today (for daily-goal tasks). */
export function getLessonsCompletedToday(state: ProgressState): number {
  const today = toDateStr(new Date());
  return Object.values(state.progressByLesson).filter(
    (r) => r.status === 'completed' && datePrefix(r.completed_at) === today
  ).length;
}

// ─── Module-level ───────────────────────────────────────────────────────────

export function isModuleComplete(state: ProgressState, moduleId: string): boolean {
  const module = getModule(moduleId);
  if (!module || module.lessons.length === 0) return false;
  return module.lessons.every((l) => lessonStatus(state, l.id) === 'completed');
}

/** A module unlocks once every prerequisite module is complete. */
export function isModuleUnlocked(state: ProgressState, moduleId: string): boolean {
  const module = getModule(moduleId);
  if (!module) return false;
  return module.prerequisites.every((pid) => isModuleComplete(state, pid));
}

export function getModuleProgress(state: ProgressState, module: Module): ModuleProgress {
  const total = module.lessons.length;
  const completed = module.lessons.filter((l) => lessonStatus(state, l.id) === 'completed').length;
  const anyStarted = module.lessons.some((l) => lessonStatus(state, l.id) !== 'not_started');
  const unlocked = isModuleUnlocked(state, module.id);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const status: ModuleProgress['status'] =
    completed === total && total > 0 ? 'completed'
    : !unlocked ? 'locked'
    : anyStarted ? 'in_progress'
    : 'not_started';

  return {
    module,
    completedLessons: completed,
    totalLessons: total,
    percent,
    status,
    unlocked,
    durationMinutes: moduleDuration(module),
  };
}

export function getAllModuleProgress(state: ProgressState): ModuleProgress[] {
  return CURRICULUM.map((m) => getModuleProgress(state, m));
}

// ─── The current lesson ─────────────────────────────────────────────────────

/**
 * What "Continue Learning" points at:
 *   1. the most recently viewed in-progress lesson, else
 *   2. the first not-started lesson inside an unlocked module (roadmap order), else
 *   3. the very first lesson (fresh install) — never null, so the UI always has a target.
 */
export function getCurrentLessonRef(state: ProgressState): LessonRef {
  const inProgress = LESSON_REFS
    .filter((ref) => lessonStatus(state, ref.lesson.id) === 'in_progress')
    .sort((a, b) => {
      const av = state.progressByLesson[a.lesson.id]?.last_viewed_at ?? '';
      const bv = state.progressByLesson[b.lesson.id]?.last_viewed_at ?? '';
      return bv.localeCompare(av); // most recent first
    });
  if (inProgress.length > 0) return inProgress[0];

  const nextNew = LESSON_REFS.find(
    (ref) =>
      lessonStatus(state, ref.lesson.id) === 'not_started' &&
      isModuleUnlocked(state, ref.module.id)
  );
  if (nextNew) return nextNew;

  // Everything unlocked is done (or nothing unlocked yet) — fall back to first lesson.
  return LESSON_REFS[0];
}

/** Fraction 0–1 of a lesson's blocks already "seen": completed → 1, in progress → partial. */
export function getLessonProgressFraction(state: ProgressState, lessonId: string): number {
  const status = lessonStatus(state, lessonId);
  if (status === 'completed') return 1;
  if (status === 'in_progress') return 0.35; // viewed but not finished
  return 0;
}

// ─── Streaks & study time ───────────────────────────────────────────────────

function minutesOn(state: ProgressState, dateStr: string): number {
  return state.streakRows.find((r) => r.date === dateStr)?.minutes_studied ?? 0;
}

export function getMinutesToday(state: ProgressState): number {
  return minutesOn(state, toDateStr(new Date()));
}

/** Consecutive days up to (and including today, or yesterday) with any study. */
export function getCurrentStreak(state: ProgressState): number {
  const active = new Set(
    state.streakRows.filter((r) => r.minutes_studied > 0).map((r) => r.date)
  );
  if (active.size === 0) return 0;

  // Anchor on today if active, otherwise yesterday, so an unfinished today
  // doesn't reset a real streak.
  let offset = active.has(daysAgoStr(0)) ? 0 : active.has(daysAgoStr(1)) ? 1 : -1;
  if (offset === -1) return 0;

  let streak = 0;
  while (active.has(daysAgoStr(offset))) {
    streak++;
    offset++;
  }
  return streak;
}

export function getStudyTotals(state: ProgressState): { totalMinutes: number; activeDays: number } {
  const active = state.streakRows.filter((r) => r.minutes_studied > 0);
  return {
    totalMinutes: active.reduce((n, r) => n + r.minutes_studied, 0),
    activeDays: active.length,
  };
}

export interface DayActivity {
  label: string;   // single-letter weekday
  minutes: number;
  value: number;    // 0–1, normalised to the busiest day in the window
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Last 7 days, oldest → newest, for the activity bar chart. */
export function getWeeklyActivity(state: ProgressState): DayActivity[] {
  const days: { dateStr: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dateStr = daysAgoStr(i);
    days.push({ dateStr, minutes: minutesOn(state, dateStr) });
  }
  const max = Math.max(1, ...days.map((d) => d.minutes));
  return days.map((d) => {
    const dow = new Date(`${d.dateStr}T00:00:00Z`).getUTCDay();
    return {
      label: WEEKDAY_LETTERS[dow],
      minutes: d.minutes,
      value: d.minutes / max,
    };
  });
}

// ─── Garden, daily stats, weakest topic ─────────────────────────────────────

export interface GardenStats {
  mastered: number;  // completed lessons
  learning: number;  // in-progress lessons
  review: number;    // completed lessons due for review
  health: number;    // 0–100
}

export function getGardenStats(state: ProgressState): GardenStats {
  const mastered = getCompletedLessonCount(state);
  const learning = getInProgressLessonCount(state);
  const review = getReviewDueCount(state);
  const streak = getCurrentStreak(state);
  const studiedToday = getMinutesToday(state) > 0;

  let health: number;
  if (mastered === 0 && learning === 0) {
    health = 0; // an unplanted garden
  } else {
    const base = 50;
    const streakBonus = Math.min(40, streak * 6);
    const todayBonus = studiedToday ? 10 : 0;
    const reviewPenalty = Math.min(30, review * 6);
    health = clamp(base + streakBonus + todayBonus - reviewPenalty, 0, 100);
  }
  return { mastered, learning, review, health: Math.round(health) };
}

export interface DailyStats {
  completionPercentage: number; // 0–100 toward today's goal
  minutesToday: number;
  currentStreak: number;
}

export function getDailyStats(state: ProgressState): DailyStats {
  const minutesToday = getMinutesToday(state);
  return {
    completionPercentage: clamp(Math.round((minutesToday / DAILY_GOAL_MINUTES) * 100), 0, 100),
    minutesToday,
    currentStreak: getCurrentStreak(state),
  };
}

/** The unlocked, started-but-unfinished module with the least progress. */
export function getWeakestModule(state: ProgressState): ModuleProgress | null {
  const candidates = getAllModuleProgress(state)
    .filter((m) => m.status === 'in_progress')
    .sort((a, b) => a.percent - b.percent);
  return candidates[0] ?? null;
}

/** Overall roadmap completion, 0–100. */
export function getOverallPercent(state: ProgressState): number {
  const total = LESSON_REFS.length;
  if (total === 0) return 0;
  return Math.round((getCompletedLessonCount(state) / total) * 100);
}

export function getMasteredModules(state: ProgressState): Module[] {
  return CURRICULUM.filter((m) => isModuleComplete(state, m.id));
}

// ─── Utility ────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}

export { countQuizzes };
