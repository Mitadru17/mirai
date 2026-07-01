# Mirai Home Feature

Production-ready home experience organized as a modular feature.

## Architecture

```
features/home/
├── components/          # UI section components
│   ├── GreetingSection.tsx
│   ├── ContinueLearningCard.tsx
│   ├── TodaysJourneyCard.tsx
│   ├── DailyProgressCard.tsx
│   ├── ReviewReminderCard.tsx
│   ├── GardenPreviewCard.tsx
│   ├── InsightCard.tsx
│   ├── QuoteCard.tsx
│   └── index.ts
├── hooks/               # Custom React hooks
│   ├── useHomeData.ts
│   ├── useRotatingContent.ts
│   └── index.ts
├── services/            # Maps live progress → view-models
│   ├── homeDataService.ts
│   └── rotatingContentService.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── index.ts             # Barrel export
└── README.md
```

## Features

### 1. Greeting Section
- Time-based greeting (Morning/Afternoon/Evening/Night)
- Rotating welcome messages (5 variants)
- Personalized with user name

### 2. Continue Learning Card
- Primary hero card
- Current lesson name and topic
- Progress bar showing completion
- Time remaining estimate
- Continue button with navigation

### 3. Today's Journey Card
- Three daily tasks derived from real progress (lesson done, study goal, review/streak)
- Completion reflects persisted state — not togglable
- Tapping a task navigates to the relevant lesson

### 4. Daily Progress Card
- Animated progress ring (0-100%)
- Study minutes today
- Current streak with flame icon
- Stats display at bottom

### 5. Review Reminder Card (Conditional)
- Only shows when reviews exist
- Topic name needing review
- Estimated review time
- Review button with navigation

### 6. Garden Preview Card
- Garden health percentage
- SVG plant icon
- Growth percentage
- View Garden button

### 7. Daily Insight Card
- Rotating personalized insights (5 variants)
- Rotates daily based on date
- Encouraging tone

### 8. Quote Card
- Rotating calm quotes (5 variants)
- Rotates daily based on date
- Minimal styling with accent line

## Data Flow

```
HomeScreen
    ↓
useHomeData() hook
    ↓
useLearning()  ← src/stores/progressStore (hydrated from SQLite)
    ↓
buildHomeData(snapshot)  ← homeDataService.ts (pure mapper)
    ↓
Components receive real, persisted data props
```

All Home data is now live: it derives from the curriculum + the SQLite-backed
progress store (`src/stores/progressStore`, `src/services/progressService`).
`homeDataService.buildHomeData()` is a pure function mapping the learning
snapshot into the card view-models — there is no mock data.

## Rotating Content

Content rotates daily based on day-of-year calculation:
- Greeting messages
- Daily insights
- Quotes

Uses date-based rotation to ensure different content each day without requiring storage.

## State Management

- **Zustand (Global)**: `progressStore` — lesson progress + streaks, hydrated from SQLite at startup
- **Derived view-model**: `useLearning()` memoises the full learning snapshot
- **Home mapping**: `useHomeData()` maps the snapshot into card props

## Animations

Staggered entrance animations:
- Greeting: 0ms
- Continue Card: 60ms
- Journey Card: 120ms
- Progress Card: 180ms
- Review Card (conditional): 240ms
- Garden Card: 240ms/300ms
- Insight Card: 300ms/360ms
- Quote Card: 360ms/420ms

All animations use `FadeIn` component from `src/components/ui/`.

## Navigation

Live navigation via `expo-router`:
- Continue button → `/lesson/[lessonId]` (current lesson)
- Daily task → the relevant lesson
- Review button → `/lesson/[lessonId]` (the lesson due for review)
- View Garden button → `/(tabs)/journal` (Memory Garden)

## Responsive Design

Supports:
- iPhone SE (375px width)
- iPhone 15 (390px width)
- iPhone Pro Max (430px width)

All spacing uses theme tokens for consistency.

## Accessibility

- All interactive elements have proper accessibility labels
- Progress components announce values to screen readers
- Proper color contrast from theme
- Touch targets meet 44x44 minimum (handled by AnimatedPressable)

## Code Quality

✅ Zero TypeScript errors
✅ Zero inline styles (all use StyleSheet.create)
✅ Fully typed with strict mode
✅ Clean separation: UI/logic/data
✅ Components < 200 lines each
✅ Reuses all existing UI components
✅ No console.logs in production paths
✅ No hardcoded values (uses theme tokens)

## Usage

```tsx
import { HomeScreen } from './features/home';

// Or import individual components
import {
  GreetingSection,
  ContinueLearningCard,
  // ...
} from './features/home';
```

## Future Enhancements

1. Spaced-repetition scheduling for reviews (currently age-based ≥3 days)
2. Per-block lesson progress (finer than started/completed)
3. Add error boundaries for resilience
4. Skeleton loading states + pull-to-refresh
5. Onboarding-driven daily goal (currently a fixed 20-minute target)
