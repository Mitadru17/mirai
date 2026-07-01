# Requirements Document

## Introduction

The Mirai Home Experience is the primary entry point for users opening the application. It serves as a calm, minimal dashboard that immediately communicates where the user left off, what to do today, their progress, and what needs review. The home screen must feel beautiful and never overwhelming, using the existing locked UI system (theme, components, navigation, state management) to create a production-ready experience organized into a clean feature folder structure at `features/home/`.

## Glossary

- **Home_Screen**: The main dashboard view users see when opening the app on the Home tab
- **Greeting_Section**: The personalized header displaying time-based greeting and rotating message
- **Continue_Card**: The primary hero card showing current lesson progress with continue button
- **Journey_Section**: The list of three daily tasks users should complete
- **Progress_Card**: The card displaying daily completion percentage and streak information
- **Review_Card**: The conditional card that appears when reviews are needed
- **Garden_Card**: The preview card showing garden health and growth status
- **Insight_Card**: The card displaying personalized, rotating insights about user progress
- **Quote_Card**: The minimal card showing calm, rotating quotes
- **Home_Data_Service**: The mock data service providing all home screen data
- **Feature_Folder**: The organized directory structure at `features/home/` containing components, hooks, services, types
- **Rotating_Content**: Messages, insights, or quotes that change on each app launch based on persisted index
- **Task_State**: The completion status of daily tasks (complete/incomplete) stored in Zustand
- **Screen_Reader**: Assistive technology that reads UI elements aloud for accessibility
- **Responsive_Design**: Layout adaptation supporting iPhone SE (375px), iPhone 15 (390px), and iPhone Pro Max (430px)

## Requirements

### Requirement 1: Feature Folder Architecture

**User Story:** As a developer, I want the Home feature organized into a clean folder structure, so that the codebase remains maintainable and scalable.

#### Acceptance Criteria

1. THE Home_Feature SHALL exist at the absolute path `features/home/` in the workspace
2. THE Feature_Folder SHALL contain a `components/` subdirectory for all section components
3. THE Feature_Folder SHALL contain a `hooks/` subdirectory for custom React hooks
4. THE Feature_Folder SHALL contain a `services/` subdirectory for mock data services
5. THE Feature_Folder SHALL contain a `types/` subdirectory for TypeScript interfaces
6. THE Feature_Folder SHALL contain an `index.ts` file that barrel exports all public APIs
7. WHEN any component needs Home feature functionality, THE component SHALL import from `features/home/` barrel export

### Requirement 2: Greeting Section Display

**User Story:** As a user, I want to see a personalized greeting when I open the app, so that I feel welcomed and know what time of day it is.

#### Acceptance Criteria

1. THE Greeting_Section SHALL display "Good Morning" WHEN the device time is between 6:00 and 11:59
2. THE Greeting_Section SHALL display "Good Afternoon" WHEN the device time is between 12:00 and 16:59
3. THE Greeting_Section SHALL display "Good Evening" WHEN the device time is between 17:00 and 20:59
4. THE Greeting_Section SHALL display "Good Night" WHEN the device time is between 21:00 and 5:59
5. THE Greeting_Section SHALL display the user name from Zustand appStore below the time-based greeting
6. THE Greeting_Section SHALL display one rotating message from the predefined pool below the greeting
7. THE rotating message pool SHALL contain: "Your future grows today.", "One small step is enough.", "Let's continue.", "Welcome back.", "Focus creates growth."
8. WHEN the app launches, THE Greeting_Section SHALL increment the persisted message index and display the next message in the pool
9. WHEN the message index reaches the end of the pool, THE Greeting_Section SHALL wrap to the beginning

### Requirement 3: Continue Learning Card

**User Story:** As a user, I want to see my current lesson prominently displayed, so that I can quickly continue my learning journey.

#### Acceptance Criteria

1. THE Continue_Card SHALL be the largest and most prominent card on the Home_Screen
2. THE Continue_Card SHALL display the current lesson name from Home_Data_Service
3. THE Continue_Card SHALL display the current topic from Home_Data_Service
4. THE Continue_Card SHALL display the estimated time remaining for the lesson
5. THE Continue_Card SHALL display a ProgressBar component showing lesson completion percentage
6. THE Continue_Card SHALL display a "Continue" AppButton with arrow icon
7. THE Continue_Card SHALL include a placeholder area for a beautiful illustration
8. WHEN the user taps the Continue button, THE Home_Screen SHALL navigate to the lesson detail screen placeholder route
9. THE Continue_Card SHALL use the existing ProgressBar component from `src/components/ui/`
10. THE Continue_Card SHALL use the existing AppButton component with the sage variant

### Requirement 4: Today's Journey Section

**User Story:** As a user, I want to see my three daily tasks, so that I know what to focus on today.

#### Acceptance Criteria

1. THE Journey_Section SHALL display exactly three tasks in order: "Review yesterday", "Learn today's lesson", "Solve one practice problem"
2. THE Journey_Section SHALL display a checkmark icon WHEN a task is marked complete
3. THE Journey_Section SHALL display an empty circle icon WHEN a task is incomplete
4. WHEN a task transitions to complete, THE task SHALL animate with a scale transform and checkmark fade-in
5. THE task completion state SHALL be stored in Zustand using Task_State
6. THE Journey_Section SHALL use existing AnimatedPressable component for task interactions
7. THE Journey_Section SHALL retrieve initial task states from Home_Data_Service
8. WHEN a user taps a task, THE task SHALL toggle between complete and incomplete states

### Requirement 5: Daily Progress Card

**User Story:** As a user, I want to see my daily progress and streak, so that I feel motivated to maintain consistency.

#### Acceptance Criteria

1. THE Progress_Card SHALL display an animated ProgressRing component showing today's completion percentage (0-100%)
2. THE Progress_Card SHALL display the number of study minutes completed today
3. THE Progress_Card SHALL display the current streak count with a flame icon from lucide-react-native
4. THE Progress_Card SHALL use the existing ProgressRing component from `src/components/ui/`
5. THE Progress_Card SHALL retrieve all progress data from Home_Data_Service
6. THE ProgressRing animation SHALL use the existing animation presets from theme/animations.ts
7. WHEN today's completion reaches 100%, THE Progress_Card SHALL display the percentage in the accent lime color

### Requirement 6: Review Reminder Card

**User Story:** As a user, I want to see when I have items to review, so that I can maintain my knowledge through spaced repetition.

#### Acceptance Criteria

1. THE Review_Card SHALL be completely hidden WHEN Home_Data_Service returns no review items
2. THE Review_Card SHALL be visible WHEN Home_Data_Service returns one or more review items
3. WHEN visible, THE Review_Card SHALL display the topic name needing review
4. WHEN visible, THE Review_Card SHALL display the estimated review time
5. WHEN visible, THE Review_Card SHALL display a "Review" AppButton
6. WHEN the user taps the Review button, THE Home_Screen SHALL navigate to the review screen placeholder route
7. THE Review_Card SHALL use conditional rendering based on review data presence

### Requirement 7: Garden Preview Card

**User Story:** As a user, I want to see a preview of my garden status, so that I can track my learning ecosystem health without leaving the home screen.

#### Acceptance Criteria

1. THE Garden_Card SHALL display the garden health percentage from Home_Data_Service
2. THE Garden_Card SHALL display a plant visual using an SVG icon component
3. THE Garden_Card SHALL display the current growth percentage
4. THE Garden_Card SHALL display a "View Garden" AppButton
5. WHEN the user taps the View Garden button, THE Home_Screen SHALL navigate to the garden screen placeholder route
6. THE Garden_Card SHALL NOT implement the full Garden feature logic
7. THE plant SVG icon SHALL use colors from the theme accent lime palette

### Requirement 8: Daily Insight Card

**User Story:** As a user, I want to see personalized insights about my progress, so that I feel encouraged and aware of my growth patterns.

#### Acceptance Criteria

1. THE Insight_Card SHALL display one insight from the predefined pool
2. THE insight pool SHALL contain: "You studied 5 days this week.", "Arrays are becoming one of your strongest topics.", "Only one review remains.", "You're on a 12-day streak!", "3 topics mastered this month."
3. THE Insight_Card SHALL rotate insights on each app launch using persisted index
4. WHEN the app launches, THE Insight_Card SHALL increment the persisted insight index and display the next insight
5. WHEN the insight index reaches the end of the pool, THE Insight_Card SHALL wrap to the beginning
6. THE insights SHALL feel personal and encouraging in tone

### Requirement 9: Quote Card

**User Story:** As a user, I want to see a calm, inspirational quote, so that I feel centered and motivated.

#### Acceptance Criteria

1. THE Quote_Card SHALL display one quote from the predefined pool
2. THE quote pool SHALL contain: "The future is built quietly.", "Growth happens one day at a time.", "Consistency compounds.", "Nature does not hurry, yet everything is accomplished.", "Focus creates growth."
3. THE Quote_Card SHALL rotate quotes on each app launch using persisted index
4. WHEN the app launches, THE Quote_Card SHALL increment the persisted quote index and display the next quote
5. WHEN the quote index reaches the end of the pool, THE Quote_Card SHALL wrap to the beginning
6. THE Quote_Card SHALL use minimal styling with a subtle accent line above the quote text

### Requirement 10: Home Data Service

**User Story:** As a developer, I want a mock data service providing all home screen data, so that the UI can be built and tested before database integration.

#### Acceptance Criteria

1. THE Home_Data_Service SHALL exist at `features/home/services/homeDataService.ts`
2. THE Home_Data_Service SHALL export a function that returns mock data for current lesson (name, topic, progress, timeRemaining)
3. THE Home_Data_Service SHALL export a function that returns mock data for today's tasks (array of 3 tasks with completion status)
4. THE Home_Data_Service SHALL export a function that returns mock data for daily stats (completion percentage, minutes, streak)
5. THE Home_Data_Service SHALL export a function that returns mock data for review items (may be empty array)
6. THE Home_Data_Service SHALL export a function that returns mock data for garden data (health percentage, plant type, growth percentage)
7. THE Home_Data_Service SHALL be replaceable with SQLite service integration in the future without changing component APIs

### Requirement 11: Home Data Hook

**User Story:** As a developer, I want a custom hook that fetches and manages home screen data, so that components remain clean and focused on presentation.

#### Acceptance Criteria

1. THE useHomeData hook SHALL exist at `features/home/hooks/useHomeData.ts`
2. THE useHomeData hook SHALL fetch all data from Home_Data_Service on mount
3. THE useHomeData hook SHALL return loading state while fetching data
4. THE useHomeData hook SHALL return all home screen data (lesson, tasks, stats, reviews, garden)
5. THE useHomeData hook SHALL handle error states gracefully
6. WHEN Home_Screen mounts, THE Home_Screen SHALL call useHomeData to retrieve all necessary data

### Requirement 12: Greeting Hook

**User Story:** As a developer, I want a custom hook that determines the time-based greeting and manages rotating messages, so that the greeting logic is reusable and testable.

#### Acceptance Criteria

1. THE useGreeting hook SHALL exist at `features/home/hooks/useGreeting.ts`
2. THE useGreeting hook SHALL determine the time-based greeting based on device time
3. THE useGreeting hook SHALL manage the rotating message selection from the predefined pool
4. THE useGreeting hook SHALL persist the last shown message index using AsyncStorage or similar
5. THE useGreeting hook SHALL increment the message index on each app launch
6. THE useGreeting hook SHALL return both the greeting text and the current rotating message

### Requirement 13: Rotating Content Hook

**User Story:** As a developer, I want a generic hook for rotating insights and quotes, so that the rotation logic is not duplicated.

#### Acceptance Criteria

1. THE useRotatingContent hook SHALL exist at `features/home/hooks/useRotatingContent.ts`
2. THE useRotatingContent hook SHALL accept a content array and a storage key as parameters
3. THE useRotatingContent hook SHALL persist the last shown index using the provided storage key
4. THE useRotatingContent hook SHALL increment the index on each app launch
5. THE useRotatingContent hook SHALL wrap to the beginning when reaching the end of the content array
6. THE useRotatingContent hook SHALL return the current content item
7. THE Insight_Card SHALL use useRotatingContent with insight pool and storage key "lastInsightIndex"
8. THE Quote_Card SHALL use useRotatingContent with quote pool and storage key "lastQuoteIndex"

### Requirement 14: Navigation Integration

**User Story:** As a user, I want to navigate to other screens from the home screen, so that I can access deeper features.

#### Acceptance Criteria

1. WHEN the user taps Continue on Continue_Card, THE Home_Screen SHALL navigate using Expo Router's `router.push()` to lesson detail placeholder
2. WHEN the user taps Review on Review_Card, THE Home_Screen SHALL navigate using Expo Router's `router.push()` to review screen placeholder
3. WHEN the user taps View Garden on Garden_Card, THE Home_Screen SHALL navigate using Expo Router's `router.push()` to garden screen placeholder
4. THE Home_Screen SHALL NOT create actual destination screens (placeholders only)
5. THE navigation calls SHALL use Expo Router v6 API patterns

### Requirement 15: Animation System

**User Story:** As a user, I want smooth animations throughout the home screen, so that the experience feels polished and delightful.

#### Acceptance Criteria

1. THE Home_Screen SHALL use FadeIn component for screen entrance animation
2. THE Home_Screen SHALL apply staggered entrance animations to cards with 60-80ms delays between each card
3. THE task completion animation SHALL use scale transform combined with checkmark fade-in
4. THE ProgressRing SHALL use the animated progress animation already built into the component
5. THE card press interactions SHALL use the existing AnimatedPressable component
6. THE Home_Screen SHALL use animation presets from `theme/animations.ts` exclusively
7. THE staggered delays SHALL be: Greeting (0ms), Continue_Card (60ms), Journey_Section (120ms), Progress_Card (180ms), subsequent cards (+60ms each)

### Requirement 16: Responsive Layout

**User Story:** As a user, I want the home screen to look great on any iPhone size, so that my experience is consistent regardless of device.

#### Acceptance Criteria

1. THE Home_Screen SHALL support iPhone SE width (375px) without horizontal scrolling
2. THE Home_Screen SHALL support iPhone 15 width (390px) without horizontal scrolling
3. THE Home_Screen SHALL support iPhone Pro Max width (430px) without horizontal scrolling
4. THE Home_Screen SHALL use theme spacing tokens for all margins and padding
5. THE cards SHALL adapt their width responsively based on screen width
6. THE text content SHALL NOT overflow on small screens (375px width)
7. THE Home_Screen SHALL maintain consistent visual hierarchy across all supported widths

### Requirement 17: Code Quality and Architecture

**User Story:** As a developer, I want the home feature code to follow strict quality standards, so that the codebase remains maintainable and production-ready.

#### Acceptance Criteria

1. THE Home feature SHALL NOT duplicate any components from `src/components/ui/`
2. THE Home feature SHALL use StyleSheet.create() for all styling (no inline styles)
3. THE Home feature SHALL be fully typed using strict TypeScript
4. THE Home feature SHALL separate UI, logic, and data concerns into appropriate directories
5. THE individual components SHALL be less than 200 lines each
6. WHEN logic becomes complex, THE feature SHALL extract logic into custom hooks
7. THE feature SHALL export all public APIs through `features/home/index.ts` barrel export
8. THE feature SHALL contain no console.log statements in production code
9. THE feature SHALL contain no TODO comments in production code
10. THE feature SHALL use constants from `src/utils/constants.ts` instead of hardcoded strings where appropriate
11. THE feature SHALL use theme tokens instead of magic numbers for spacing, colors, and sizes
12. THE feature SHALL handle error boundaries appropriately
13. THE feature SHALL handle loading states for all async operations
14. THE feature SHALL handle empty states for conditional content

### Requirement 18: Accessibility

**User Story:** As a user with accessibility needs, I want the home screen to work with screen readers, so that I can navigate and understand the content.

#### Acceptance Criteria

1. THE Home_Screen buttons SHALL include accessibilityLabel props
2. THE Home_Screen pressable cards SHALL include accessibilityRole="button" when interactive
3. THE ProgressRing component SHALL announce its value to Screen_Reader users
4. THE ProgressBar component SHALL announce its value to Screen_Reader users
5. THE Home_Screen SHALL use colors with proper contrast ratios as defined in the locked theme
6. THE Home_Screen touch targets SHALL meet minimum 44x44 size (handled by existing components)
7. THE task completion status SHALL be announced to Screen_Reader users as "complete" or "incomplete"

### Requirement 19: TypeScript Type Definitions

**User Story:** As a developer, I want comprehensive TypeScript types for all home feature data, so that I catch errors at compile time.

#### Acceptance Criteria

1. THE Home feature SHALL define a CurrentLesson interface at `features/home/types/`
2. THE CurrentLesson interface SHALL include: name (string), topic (string), progress (number 0-1), timeRemaining (number in minutes)
3. THE Home feature SHALL define a DailyTask interface at `features/home/types/`
4. THE DailyTask interface SHALL include: id (string), title (string), completed (boolean)
5. THE Home feature SHALL define a DailyStats interface at `features/home/types/`
6. THE DailyStats interface SHALL include: completionPercentage (number 0-100), minutesToday (number), currentStreak (number)
7. THE Home feature SHALL define a ReviewItem interface at `features/home/types/`
8. THE ReviewItem interface SHALL include: topic (string), estimatedMinutes (number)
9. THE Home feature SHALL define a GardenData interface at `features/home/types/`
10. THE GardenData interface SHALL include: health (number 0-100), plantType (string), growth (number 0-100)
11. THE Home feature SHALL define a HomeData interface that aggregates all above interfaces
12. THE Home feature SHALL export all types through `features/home/types/index.ts`

### Requirement 20: Production Readiness

**User Story:** As a product owner, I want the home feature to be fully production-ready, so that it can be deployed without additional polish work.

#### Acceptance Criteria

1. THE Home feature SHALL produce zero TypeScript compilation errors
2. THE Home feature SHALL produce zero ESLint errors
3. THE Home feature SHALL handle all edge cases (no data, loading states, empty arrays)
4. THE Home feature SHALL use proper null/undefined checks for all optional data
5. THE Home feature SHALL gracefully degrade when services return empty data
6. THE Home feature mock data SHALL be realistic and demonstrate all features
7. THE Home feature SHALL be visually consistent with the existing locked UI system
8. THE Home feature SHALL use proper memo/callback optimizations where beneficial
9. THE Home feature SHALL clean up all side effects (listeners, timers) on unmount
