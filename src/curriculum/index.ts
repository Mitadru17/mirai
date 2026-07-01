/**
 * Curriculum Registry
 *
 * Assembles all modules into an ordered roadmap and exposes pure selectors for
 * looking up modules and lessons. Everything in the app that needs to know
 * "what is the next lesson?" or "which module owns this lesson?" comes through
 * here. Adding a module = author its file and register it in MODULES below.
 */

import type { Module, Lesson, LessonRef } from './types';
import { programmingBasicsModule } from './modules/programmingBasics';
import { bigOModule } from './modules/bigO';
import { arraysModule } from './modules/arrays';
import { stringsModule } from './modules/strings';
import { linkedListsModule } from './modules/linkedLists';
import { stacksModule } from './modules/stacks';

// ─── Assembly ───────────────────────────────────────────────────────────────

const MODULES: Module[] = [
  programmingBasicsModule,
  bigOModule,
  arraysModule,
  stringsModule,
  linkedListsModule,
  stacksModule,
];

/** The full roadmap, guaranteed ordered by `order` ascending. */
export const CURRICULUM: Module[] = [...MODULES].sort((a, b) => a.order - b.order);

const MODULE_BY_ID = new Map<string, Module>(CURRICULUM.map((m) => [m.id, m]));

/** Every lesson flattened in roadmap order, each paired with its module + indices. */
export const LESSON_REFS: LessonRef[] = (() => {
  const refs: LessonRef[] = [];
  let globalIndex = 0;
  for (const module of CURRICULUM) {
    module.lessons.forEach((lesson, indexInModule) => {
      refs.push({ lesson, module, indexInModule, globalIndex: globalIndex++ });
    });
  }
  return refs;
})();

const LESSON_REF_BY_ID = new Map<string, LessonRef>(
  LESSON_REFS.map((ref) => [ref.lesson.id, ref])
);

// ─── Aggregate counts ───────────────────────────────────────────────────────

export const TOTAL_MODULES = CURRICULUM.length;
export const TOTAL_LESSONS = LESSON_REFS.length;

// ─── Selectors ──────────────────────────────────────────────────────────────

export function getModule(moduleId: string): Module | undefined {
  return MODULE_BY_ID.get(moduleId);
}

export function getLesson(lessonId: string): Lesson | undefined {
  return LESSON_REF_BY_ID.get(lessonId)?.lesson;
}

export function getLessonRef(lessonId: string): LessonRef | undefined {
  return LESSON_REF_BY_ID.get(lessonId);
}

export function getModuleForLesson(lessonId: string): Module | undefined {
  return LESSON_REF_BY_ID.get(lessonId)?.module;
}

/** The first lesson of a module (roadmap entry point). */
export function getFirstLesson(moduleId: string): Lesson | undefined {
  return MODULE_BY_ID.get(moduleId)?.lessons[0];
}

/** The next lesson in global roadmap order, or null at the very end. */
export function getNextLesson(lessonId: string): LessonRef | null {
  const ref = LESSON_REF_BY_ID.get(lessonId);
  if (!ref) return null;
  return LESSON_REFS[ref.globalIndex + 1] ?? null;
}

/** The previous lesson in global roadmap order, or null at the very start. */
export function getPrevLesson(lessonId: string): LessonRef | null {
  const ref = LESSON_REF_BY_ID.get(lessonId);
  if (!ref || ref.globalIndex === 0) return null;
  return LESSON_REFS[ref.globalIndex - 1] ?? null;
}

/** Resolve a list of related lesson ids to full lessons, skipping any unknown ids. */
export function getRelatedLessons(lesson: Lesson): Lesson[] {
  return (lesson.relatedLessonIds ?? [])
    .map((id) => getLesson(id))
    .filter((l): l is Lesson => l != null);
}

// ─── Re-exports ─────────────────────────────────────────────────────────────

export * from './types';
export { getCurriculumIcon } from './icons';
