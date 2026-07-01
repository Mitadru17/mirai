/**
 * Mirai Home Screen — Daily Dashboard
 * Production-ready home experience with modular feature architecture.
 */

import React from 'react';
import { AppScreen, LoadingIndicator, FadeIn, AppText } from '../../src/components/ui';
import {
  GreetingSection,
  ContinueLearningCard,
  TodaysJourneyCard,
  DailyProgressCard,
  ReviewReminderCard,
  GardenPreviewCard,
  InsightCard,
  QuoteCard,
} from '../../features/home';
import { useHomeData } from '../../features/home/hooks/useHomeData';
import { useDailyTasks } from '../../features/home/hooks/useDailyTasks';

export default function HomeScreen() {
  const { data, isLoading, error } = useHomeData();
  
  // Call all hooks before any conditional returns (Rules of Hooks)
  const { tasks, toggleTask } = useDailyTasks(data?.dailyTasks ?? []);

  if (isLoading || !data) {
    return (
      <AppScreen>
        <LoadingIndicator />
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <AppText variant="body" color="red">
          Failed to load home data
        </AppText>
      </AppScreen>
    );
  }

  return (
    <AppScreen scrollable>
      {/* Greeting */}
      <FadeIn delay={0} duration={420}>
        <GreetingSection />
      </FadeIn>

      {/* Continue Learning - Primary hero card */}
      <FadeIn delay={60} duration={420}>
        <ContinueLearningCard lesson={data.currentLesson} />
      </FadeIn>

      {/* Today's Journey */}
      <FadeIn delay={120} duration={420}>
        <TodaysJourneyCard tasks={tasks} onToggleTask={toggleTask} />
      </FadeIn>

      {/* Daily Progress */}
      <FadeIn delay={180} duration={420}>
        <DailyProgressCard stats={data.dailyStats} />
      </FadeIn>

      {/* Review Reminder - Conditional */}
      {data.reviews.length > 0 && (
        <FadeIn delay={240} duration={420}>
          <ReviewReminderCard review={data.reviews[0]} />
        </FadeIn>
      )}

      {/* Garden Preview */}
      <FadeIn delay={data.reviews.length > 0 ? 300 : 240} duration={420}>
        <GardenPreviewCard garden={data.garden} />
      </FadeIn>

      {/* Daily Insight */}
      <FadeIn delay={data.reviews.length > 0 ? 360 : 300} duration={420}>
        <InsightCard />
      </FadeIn>

      {/* Quote */}
      <FadeIn delay={data.reviews.length > 0 ? 420 : 360} duration={420}>
        <QuoteCard />
      </FadeIn>
    </AppScreen>
  );
}
