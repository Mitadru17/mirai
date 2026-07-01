/**
 * Home Data Service
 *
 * Maps the derived learning snapshot (real, persisted progress) into the
 * view-models the Home cards consume. Pure and synchronous — no mock data.
 */

import type { LearningSnapshot } from '../../../src/stores/progressStore';
import { DAILY_GOAL_MINUTES } from '../../../src/stores/learningSelectors';
import type {
  HomeData,
  CurrentLesson,
  DailyTask,
  DailyStats,
  ReviewItem,
  GardenData,
} from '../types';

/** A friendly plant-stage name based on how many lessons are mastered. */
function describePlant(mastered: number): string {
  if (mastered === 0) return 'Ungerminated Seed';
  if (mastered < 3) return 'Tender Sprout';
  if (mastered < 6) return 'Young Seedling';
  if (mastered < 12) return 'Growing Sapling';
  if (mastered < 20) return 'Sturdy Oak';
  return 'Ancient Oak';
}

function toCurrentLesson(learning: LearningSnapshot): CurrentLesson {
  const { lesson, module } = learning.currentLessonRef;
  return {
    id: lesson.id,
    name: lesson.title,
    topic: module.title,
    progress: learning.lessonFraction(lesson.id),
    timeRemaining: lesson.estimatedMinutes,
  };
}

function toDailyTasks(learning: LearningSnapshot): DailyTask[] {
  const currentHref = `/lesson/${learning.currentLessonRef.lesson.id}`;
  const review = learning.reviewLessons[0];

  const tasks: DailyTask[] = [
    {
      id: 'learn',
      title: "Learn today's lesson",
      completed: learning.lessonsCompletedToday >= 1,
      href: currentHref,
    },
    {
      id: 'goal',
      title: `Study for ${DAILY_GOAL_MINUTES} minutes`,
      completed: learning.minutesToday >= DAILY_GOAL_MINUTES,
      href: currentHref,
    },
  ];

  if (review) {
    tasks.push({
      id: 'review',
      title: `Review ${review.module.title}`,
      completed: false,
      href: `/lesson/${review.lesson.id}`,
    });
  } else {
    tasks.push({
      id: 'streak',
      title: 'Keep your streak alive',
      completed: learning.currentStreak > 0 && learning.minutesToday > 0,
      href: currentHref,
    });
  }

  return tasks;
}

function toReviews(learning: LearningSnapshot): ReviewItem[] {
  return learning.reviewLessons.slice(0, 1).map((ref) => ({
    topic: ref.lesson.title,
    estimatedMinutes: Math.max(3, Math.round(ref.lesson.estimatedMinutes / 2)),
    lessonId: ref.lesson.id,
  }));
}

function toGarden(learning: LearningSnapshot): GardenData {
  return {
    health: learning.garden.health,
    plantType: describePlant(learning.garden.mastered),
    growth: learning.overallPercent,
  };
}

function toDailyStats(learning: LearningSnapshot): DailyStats {
  return {
    completionPercentage: learning.dailyStats.completionPercentage,
    minutesToday: learning.dailyStats.minutesToday,
    currentStreak: learning.dailyStats.currentStreak,
  };
}

export function buildHomeData(learning: LearningSnapshot): HomeData {
  return {
    currentLesson: toCurrentLesson(learning),
    dailyTasks: toDailyTasks(learning),
    dailyStats: toDailyStats(learning),
    reviews: toReviews(learning),
    garden: toGarden(learning),
  };
}
