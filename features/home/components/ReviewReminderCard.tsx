/**
 * Review Reminder Card
 * Conditional card that appears when reviews are needed.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppCard, AppText, AppButton } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout, radius } from '../../../src/theme/spacing';
import { formatDuration } from '../../../src/utils/helpers';
import type { ReviewItem } from '../types';

interface ReviewReminderCardProps {
  review: ReviewItem;
}

export function ReviewReminderCard({ review }: ReviewReminderCardProps) {
  const colors = useColors();
  const router = useRouter();

  const handleReview = () => {
    // TODO: Navigate to review screen when route exists
    console.log('Navigate to review:', review.topic);
  };

  return (
    <AppCard padding={spacing.xl} variant="default" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <RotateCcw size={18} color={colors.accent.lime} strokeWidth={1.5} />
        </View>
        <View style={styles.headerText}>
          <AppText variant="label" color={colors.secondary} style={styles.label}>
            REVIEW READY
          </AppText>
          <AppText variant="subheadlineMedium" color={colors.primary} style={styles.topic}>
            {review.topic}
          </AppText>
          <AppText variant="caption" color={colors.tertiary}>
            {formatDuration(review.estimatedMinutes)} review
          </AppText>
        </View>
      </View>

      <AppButton
        title="Start Review"
        variant="secondary"
        size="sm"
        onPress={handleReview}
        style={styles.button}
        accessibilityLabel={`Review ${review.topic}`}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  header: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.base,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(190,255,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  label: {
    marginBottom: spacing.xs,
  },
  topic: {
    marginBottom: 2,
  },
  button: {
    borderRadius: radius.lg,
  },
});
