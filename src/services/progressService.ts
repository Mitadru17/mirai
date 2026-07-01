/**
 * Progress Service
 *
 * The only module that reads/writes learning progress in SQLite. Everything
 * above it (the progress store, screens) works with the plain typed rows this
 * returns — it never touches SQL directly. This keeps persistence swappable
 * (e.g. for future cloud sync) behind a stable interface.
 */

import { getDatabase } from './database';
import { getTodayString } from '../utils/helpers';

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

export interface LessonProgressRow {
  lesson_id: string;
  module_id: string;
  status: LessonStatus;
  quiz_correct: number;
  quiz_total: number;
  last_viewed_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface StreakRow {
  date: string;             // YYYY-MM-DD
  minutes_studied: number;
  topics_completed: number;
}

// ─── Lesson progress ────────────────────────────────────────────────────────

export async function getAllLessonProgress(): Promise<LessonProgressRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<LessonProgressRow>(
    'SELECT * FROM lesson_progress ORDER BY updated_at DESC'
  );
}

/**
 * Mark a lesson as being viewed. Sets it to in_progress and stamps the view
 * time — but never downgrades an already-completed lesson.
 */
export async function markLessonStarted(lessonId: string, moduleId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO lesson_progress (lesson_id, module_id, status, last_viewed_at, updated_at)
       VALUES (?, ?, 'in_progress', datetime('now'), datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       last_viewed_at = datetime('now'),
       updated_at     = datetime('now'),
       status = CASE WHEN lesson_progress.status = 'completed'
                     THEN 'completed' ELSE 'in_progress' END`,
    lessonId,
    moduleId
  );
}

/**
 * Mark a lesson complete and record the quiz result. Preserves the original
 * completion timestamp if the lesson was already finished before.
 */
export async function markLessonCompleted(
  lessonId: string,
  moduleId: string,
  quizCorrect: number,
  quizTotal: number
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO lesson_progress
       (lesson_id, module_id, status, quiz_correct, quiz_total, last_viewed_at, completed_at, updated_at)
       VALUES (?, ?, 'completed', ?, ?, datetime('now'), datetime('now'), datetime('now'))
     ON CONFLICT(lesson_id) DO UPDATE SET
       status       = 'completed',
       quiz_correct = ?,
       quiz_total   = ?,
       last_viewed_at = datetime('now'),
       completed_at = COALESCE(lesson_progress.completed_at, datetime('now')),
       updated_at   = datetime('now')`,
    lessonId,
    moduleId,
    quizCorrect,
    quizTotal,
    quizCorrect,
    quizTotal
  );
}

// ─── Study / streak tracking ────────────────────────────────────────────────

/**
 * Add study time (and optionally completed-lesson count) to today's row.
 * Accumulates across multiple sessions in the same day.
 */
export async function recordStudy(
  minutes: number,
  lessonsCompleted: number = 0,
  dateStr: string = getTodayString()
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO streaks (date, minutes_studied, topics_completed)
       VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET
       minutes_studied  = streaks.minutes_studied + excluded.minutes_studied,
       topics_completed = streaks.topics_completed + excluded.topics_completed`,
    dateStr,
    Math.max(0, Math.round(minutes)),
    Math.max(0, lessonsCompleted)
  );
}

/** All daily study rows, newest first. */
export async function getStreakRows(): Promise<StreakRow[]> {
  const db = await getDatabase();
  return db.getAllAsync<StreakRow>(
    'SELECT date, minutes_studied, topics_completed FROM streaks ORDER BY date DESC'
  );
}
