# Home Feature Architecture

## Visual Component Tree

```
HomeScreen (app/(tabs)/index.tsx)
│
├─ AppScreen (scrollable wrapper)
│  │
│  ├─ FadeIn (0ms)
│  │  └─ GreetingSection
│  │     ├─ AppText (greeting)
│  │     └─ AppText (message)
│  │
│  ├─ FadeIn (60ms)
│  │  └─ ContinueLearningCard
│  │     ├─ AppCard (variant="glow")
│  │     ├─ AppText (label)
│  │     ├─ AppText (title)
│  │     ├─ AppText (lesson name)
│  │     ├─ ProgressBar
│  │     └─ AppButton (continue)
│  │
│  ├─ FadeIn (120ms)
│  │  └─ TodaysJourneyCard
│  │     ├─ AppCard
│  │     ├─ AppText (label)
│  │     └─ TaskItem × 3
│  │        ├─ AnimatedPressable
│  │        ├─ Icon (CheckCircle2 | Circle)
│  │        └─ AppText (task title)
│  │
│  ├─ FadeIn (180ms)
│  │  └─ DailyProgressCard
│  │     ├─ AppCard
│  │     ├─ Header
│  │     │  ├─ AppText (label)
│  │     │  └─ Streak Badge
│  │     ├─ ProgressRing
│  │     └─ Stats Row
│  │        ├─ Study Time
│  │        └─ Completed %
│  │
│  ├─ FadeIn (240ms) [CONDITIONAL]
│  │  └─ ReviewReminderCard
│  │     ├─ AppCard
│  │     ├─ Icon Wrapper
│  │     ├─ AppText (topic)
│  │     └─ AppButton (review)
│  │
│  ├─ FadeIn (240/300ms)
│  │  └─ GardenPreviewCard
│  │     ├─ AppCard
│  │     ├─ PlantIcon (SVG)
│  │     ├─ Garden Stats
│  │     └─ AppButton (view garden)
│  │
│  ├─ FadeIn (300/360ms)
│  │  └─ InsightCard
│  │     ├─ AppCard (variant="surface")
│  │     ├─ Icon (Sparkles)
│  │     └─ AppText (insight)
│  │
│  └─ FadeIn (360/420ms)
     └─ QuoteCard
        ├─ Accent Line
        └─ AppText (quote)
```

## Data Flow Diagram

```
┌──────────────────────────────────────────┐
│         HomeScreen Component             │
└──────────────┬───────────────────────────┘
               │
               ├─ useHomeData()
               │     │
               │     ├─ useState(loading)
               │     ├─ useState(error)
               │     ├─ useState(data)
               │     │
               │     └─ useEffect
               │           │
               │           └─ getHomeData()
               │                 │
               │                 ├─ getCurrentLesson()
               │                 ├─ getDailyTasks()
               │                 ├─ getDailyStats()
               │                 ├─ getReviews()
               │                 └─ getGardenData()
               │
               ├─ useDailyTasks(initialTasks)
               │     │
               │     ├─ useState(tasks)
               │     └─ toggleTask(id)
               │
               ├─ useGreetingData()
               │     └─ getGreeting() + getGreetingMessage()
               │
               ├─ useInsight()
               │     └─ getInsight()
               │
               └─ useQuote()
                     └─ getQuote()
```

## Service Layer Architecture

```
┌─────────────────────────────────────────┐
│       homeDataService.ts (Mock)         │
├─────────────────────────────────────────┤
│  getCurrentLesson() → CurrentLesson     │
│  getDailyTasks() → DailyTask[]          │
│  getDailyStats() → DailyStats           │
│  getReviews() → ReviewItem[]            │
│  getGardenData() → GardenData           │
│  getHomeData() → HomeData               │
└─────────────────────────────────────────┘
                   │
                   │ (Future Migration)
                   ↓
┌─────────────────────────────────────────┐
│    src/database/queries/homeQueries.ts  │
├─────────────────────────────────────────┤
│  getCurrentLesson() → CurrentLesson     │
│  getDailyTasks() → DailyTask[]          │
│  getDailyStats() → DailyStats           │
│  getReviews() → ReviewItem[]            │
│  getGardenData() → GardenData           │
│  getHomeData() → HomeData               │
└─────────────────────────────────────────┘
         ↑
         │ Same Interface!
         │ Zero Component Changes
```

## State Management Layers

```
┌─────────────────────────────────────────┐
│         GLOBAL STATE (Zustand)          │
├─────────────────────────────────────────┤
│  userName: string                       │
│  currentStreak: number                  │
│  totalMinutesStudied: number            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       FEATURE STATE (Hooks)             │
├─────────────────────────────────────────┤
│  homeData: HomeData | null              │
│  isLoading: boolean                     │
│  error: Error | null                    │
│  tasks: DailyTask[]                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      COMPONENT STATE (React)            │
├─────────────────────────────────────────┤
│  greeting: string                       │
│  message: string                        │
│  insight: string                        │
│  quote: string                          │
└─────────────────────────────────────────┘
```

## Component Communication Patterns

### Parent → Child (Props)

```typescript
// HomeScreen passes data down
<ContinueLearningCard lesson={data.currentLesson} />
<TodaysJourneyCard tasks={tasks} onToggleTask={toggleTask} />
<DailyProgressCard stats={data.dailyStats} />
```

### Child → Parent (Callbacks)

```typescript
// Task completion bubbles up
const toggleTask = (taskId: string) => {
  setTasks(prev => 
    prev.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    )
  );
};
```

### Sibling → Sibling (Shared State)

```typescript
// No direct sibling communication
// All state flows through parent (HomeScreen)
```

## Conditional Rendering Logic

```typescript
// Review Card - Only shows when reviews exist
{data.reviews.length > 0 && (
  <ReviewReminderCard review={data.reviews[0]} />
)}

// Adjusts subsequent animation delays based on review presence
delay={data.reviews.length > 0 ? 300 : 240}
```

## Theme Integration Points

```typescript
// Every component imports colors
import { useColors } from '@/theme/ThemeContext';

// Usage
const colors = useColors();
<AppText color={colors.primary}>
<Icon color={colors.accent.lime}>
```

## File Dependencies

```
app/(tabs)/index.tsx
├── src/components/ui
│   ├── AppScreen
│   ├── LoadingIndicator
│   ├── FadeIn
│   └── AppText
├── features/home
│   ├── components (all 8 cards)
│   ├── hooks
│   │   ├── useHomeData
│   │   └── useDailyTasks
│   └── types
└── External
    ├── react-native-reanimated
    └── lucide-react-native
```

## Animation Timing Diagram

```
Time (ms)      0        60       120      180      240      300      360      420
               │        │        │        │        │        │        │        │
Greeting       ■════════════════════════════════════════════════════════════════
Continue       │        ■════════════════════════════════════════════════════════
Journey        │        │        ■════════════════════════════════════════════════
Progress       │        │        │        ■════════════════════════════════════════
Review*        │        │        │        │        ■════════════════════════════════
Garden         │        │        │        │        ■════════════════════════════════
Insight        │        │        │        │        │        ■════════════════════════
Quote          │        │        │        │        │        │        ■════════════════

*Review card optional - other cards adjust timing when absent
All animations: 420ms duration with easeOut easing
```

## Error Handling Flow

```
useHomeData()
    │
    ├─ Try
    │   ├─ setLoading(true)
    │   ├─ await getHomeData()
    │   ├─ setData(result)
    │   └─ setError(null)
    │
    └─ Catch
        ├─ setError(error)
        └─ setData(null)
    
    Finally
        └─ setLoading(false)

HomeScreen
    │
    ├─ if (isLoading) → <LoadingIndicator />
    ├─ if (error) → <ErrorMessage />
    └─ else → <MainContent />
```

## Performance Optimization Strategy

### Memoization

```typescript
// useDailyTasks hook
const toggleTask = useCallback((taskId: string) => {
  setTasks(prev => /* ... */);
}, []); // Stable reference

// No unnecessary re-renders of child components
```

### Animation Performance

```typescript
// All animations run on UI thread via Reanimated
// 60fps guaranteed on supported devices
FadeIn → withTiming() → runs on UI thread
ProgressRing → useAnimatedProps() → runs on UI thread
AnimatedPressable → withSpring() → runs on UI thread
```

### Render Optimization

```typescript
// Conditional rendering prevents unnecessary work
{reviews.length > 0 && <ReviewCard />}

// Early returns prevent full tree render
if (isLoading) return <Loading />;
if (error) return <Error />;
return <Content />;
```

## Testing Points

### Unit Tests (Recommended)
- `useHomeData` hook loading states
- `useDailyTasks` toggle logic
- Rotating content index calculation
- Data service mock implementations

### Integration Tests (Recommended)
- Home screen data loading flow
- Task completion interaction
- Navigation placeholder calls
- Conditional review card display

### E2E Tests (Recommended)
- Full screen render
- Staggered animations complete
- All interactive elements tappable
- VoiceOver navigation flow

## Maintenance Checklist

### Adding New Card
1. Create component in `features/home/components/`
2. Add to `components/index.ts` export
3. Import in `HomeScreen`
4. Add `<FadeIn>` wrapper with appropriate delay
5. Pass data via props from `homeData`
6. Update this architecture doc

### Modifying Data Structure
1. Update types in `features/home/types/index.ts`
2. Update mock service return types
3. Update hook return types
4. TypeScript will catch any breaks
5. Update component props if needed

### Migrating to SQLite
1. Create `src/database/queries/homeQueries.ts`
2. Implement same function signatures
3. Update import in `useHomeData.ts`
4. Test data loading
5. No component changes needed

## Security Considerations

- ✅ No user input sanitization needed (display-only)
- ✅ No XSS risk (all text from constants or validated data)
- ✅ No SQL injection risk (mock data, future: parameterized queries)
- ✅ No sensitive data displayed
- ✅ Navigation placeholders use console.log (safe)

## Accessibility Tree

```
Home Tab
├── Group: "Greeting Section"
│   ├── Text: "Good morning, Learner."
│   └── Text: "Your future grows today."
├── Button: "Continue learning" (role: button)
├── Group: "Today's Journey"
│   ├── Button: "Review yesterday, completed" (role: button)
│   ├── Button: "Learn today's lesson, not completed" (role: button)
│   └── Button: "Solve one practice problem, not completed" (role: button)
├── Group: "Today's Progress"
│   ├── ProgressIndicator: "65% complete"
│   └── Text: "12 day streak"
├── Button: "Start Review" (role: button, conditional)
├── Button: "View Garden" (role: button)
├── Group: "Daily Insight"
│   └── Text: "You studied 5 days this week."
└── Group: "Quote"
    └── Text: "The future is built quietly."
```

---

**Last Updated**: Implementation Complete
**Status**: Production Ready
**Complexity**: Medium
**Maintainability**: High
