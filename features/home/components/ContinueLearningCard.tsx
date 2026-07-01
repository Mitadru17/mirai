/**
 * Continue Learning Card
 * Primary hero card showing current lesson progress.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppCard, AppText, AppButton, ProgressBar } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, radius, layout } from '../../../src/theme/spacing';
import { formatDuration } from '../../../src/utils/helpers';
import type { CurrentLesson } from '../types';

interface ContinueLearningCardProps {
  lesson: CurrentLesson;
}

export function ContinueLearningCard({ lesson }: ContinueLearningCardProps) {
  const colors = useColors();
  const router = useRouter();

  const handleContinue = () => {
    // TODO: Navigate to lesson detail when route exists
    console.log('Navigate to lesson:', lesson.name);
  };

  return (
    <AppCard padding={spacing.xl} variant="glow" style={styles.card}>
      <AppText variant="label" color={colors.accent.lime} style={styles.label}>
        CONTINUE LEARNING
      </AppText>
      
      <AppText variant="title" color={colors.primary} style={styles.title}>
        {lesson.topic}
      </AppText>
      
      <AppText variant="subheadline" color={colors.secondary} style={styles.lessonName}>
        {lesson.name}
      </AppText>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <AppText variant="caption" color={colors.secondary}>
            Progress
          </AppText>
          <AppText variant="caption" color={colors.secondary}>
            {Math.round(lesson.progress * 100)}%
          </AppText>
        </View>
        <ProgressBar progress={lesson.progress} style={styles.progressBar} />
        <AppText variant="caption" color={colors.tertiary} style={styles.timeRemaining}>
          {formatDuration(lesson.timeRemaining)} remaining
        </AppText>
      </View>

      <AppButton
        title="Continue"
        variant="sage"
        size="md"
        icon={<ArrowRight size={16} color={colors.background} strokeWidth={2} />}
        style={styles.button}
        onPress={handleContinue}
        accessibilityLabel="Continue learning"
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  label: {
    marginBottom: spacing.sm,
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  lessonName: {
    marginBottom: spacing.xl,
  },
  progressSection: {
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  progressBar: {
    marginBottom: spacing.xs,
  },
  timeRemaining: {
    marginTop: spacing.xs,
  },
  button: {
    borderRadius: radius.lg,
  },
});
