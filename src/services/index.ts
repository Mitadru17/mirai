export { getDatabase, initializeDatabase, closeDatabase } from './database';
export {
  getAllLessonProgress,
  markLessonStarted,
  markLessonCompleted,
  recordStudy,
  getStreakRows,
} from './progressService';
export type { LessonStatus, LessonProgressRow, StreakRow } from './progressService';
