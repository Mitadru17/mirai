/**
 * Mirai Curriculum — Type System
 *
 * The single source of truth for all learning content.
 *
 * Design goal: adding hundreds of future lessons should require ONLY adding
 * structured data that conforms to these types — never touching application
 * logic or UI. Every screen (Home, Journey, Garden, Profile, Lesson) derives
 * its content from data shaped by these interfaces.
 */

// ─── Primitives ─────────────────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Semantic icon names. The UI layer (src/curriculum/icons.ts) maps each to a
 * concrete lucide component, so content never imports from the UI.
 */
export type CurriculumIcon =
  | 'terminal'
  | 'gauge'
  | 'brackets'
  | 'type'
  | 'link'
  | 'layers'
  | 'hash'
  | 'tree'
  | 'network'
  | 'repeat'
  | 'binary'
  | 'boxes';

// ─── Lesson content blocks ──────────────────────────────────────────────────

export type CalloutTone = 'info' | 'tip' | 'warning' | 'insight';

export interface ComplexityRow {
  operation: string;
  time: string;   // e.g. 'O(1)', 'O(n)', 'O(log n)'
  space?: string; // e.g. 'O(1)'
  note?: string;
}

export interface CodeStep {
  /** A single line or small group of lines, revealed step-by-step. */
  code: string;
  /** Plain-language explanation of what this step does and why. */
  explanation: string;
}

export interface MistakeItem {
  mistake: string;
  fix: string;
}

/**
 * Interactive visualization descriptor. The renderer
 * (src/components/lesson/blocks/VisualBlock) switches on `kind`. Unknown kinds
 * degrade gracefully to a captioned placeholder, so new content can reference a
 * visualization before its renderer ships.
 */
export type VisualKind =
  | 'array'        // indexed boxes with an optional highlighted index
  | 'stack'        // vertical LIFO stack with push/pop
  | 'linked-list'  // nodes connected by next-pointers
  | 'string'       // character cells with indices
  | 'bigo';        // growth-rate comparison chart

export interface VisualSpec {
  kind: VisualKind;
  caption?: string;
  /** Free-form, kind-specific configuration consumed by the matching renderer. */
  data?: Record<string, unknown>;
}

/**
 * A discriminated union of every block a lesson can render. Add a new member
 * here + a matching case in LessonBlockView to introduce a new content type.
 */
export type LessonBlock =
  | { type: 'concept'; heading?: string; body: string }
  | { type: 'analogy'; body: string; source?: string }
  | { type: 'callout'; tone: CalloutTone; body: string; title?: string }
  | { type: 'list'; heading?: string; ordered?: boolean; items: string[] }
  | { type: 'code'; language: string; code: string; caption?: string }
  | { type: 'walkthrough'; heading?: string; language: string; steps: CodeStep[] }
  | { type: 'complexity'; heading?: string; rows: ComplexityRow[] }
  | { type: 'visual'; visual: VisualSpec }
  | { type: 'mistakes'; heading?: string; items: MistakeItem[] }
  | { type: 'quiz'; question: string; options: string[]; answerIndex: number; explanation: string }
  | { type: 'summary'; points: string[] };

export type LessonBlockType = LessonBlock['type'];

// ─── Lessons & modules ──────────────────────────────────────────────────────

export interface RevisionCard {
  front: string;
  back: string;
}

export interface Lesson {
  /** Globally unique. Convention: `${moduleId}-${slug}`, e.g. 'arrays-two-pointers'. */
  id: string;
  moduleId: string;
  title: string;
  /** One concise line shown under the title. */
  subtitle: string;
  estimatedMinutes: number;
  objectives: string[];
  blocks: LessonBlock[];
  revisionCards: RevisionCard[];
  /** Lesson ids surfaced as "Related" — may point across modules. */
  relatedLessonIds?: string[];
}

export interface Module {
  /** Stable, url-safe id, e.g. 'linked-lists'. */
  id: string;
  /** Position in the linear roadmap (ascending). */
  order: number;
  title: string;
  /** Short one-line description. */
  tagline: string;
  /** Longer paragraph shown on the module overview. */
  overview: string;
  icon: CurriculumIcon;
  difficulty: Difficulty;
  /** Module ids that must be completed before this unlocks. Empty = always open. */
  prerequisites: string[];
  objectives: string[];
  lessons: Lesson[];
}

// ─── Derived / helper types ─────────────────────────────────────────────────

/** A lesson flattened together with its owning module — used by selectors. */
export interface LessonRef {
  lesson: Lesson;
  module: Module;
  /** Zero-based index of the lesson within its module. */
  indexInModule: number;
  /** Zero-based index across the entire flattened curriculum. */
  globalIndex: number;
}

/** Count of quiz blocks in a lesson — used to score completion. */
export function countQuizzes(lesson: Lesson): number {
  return lesson.blocks.reduce((n, b) => (b.type === 'quiz' ? n + 1 : n), 0);
}

/** Sum of a module's lesson durations, in minutes. */
export function moduleDuration(module: Module): number {
  return module.lessons.reduce((n, l) => n + l.estimatedMinutes, 0);
}
