/**
 * Daily Progress Card
 * Shows today's completion percentage, study minutes, and streak.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { AppCard, AppText, ProgressRing } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout } from '../../../src/theme/spacing';
import type { DailyStats } from '../types';

interface DailyProgressCardProps {
  stats: DailyStats;
}

export function DailyProgressCard({ stats }: DailyProgressCardProps) {
  const colors = useColors();

  return (
    <AppCard padding={spacing.xl} style={styles.card}>
      <View style={styles.header}>
        <AppText variant="label" color={colors.secondary} style={styles.label}>
          TODAY'S PROGRESS
        </AppText>
        <View style={styles.streak}>
          <Flame size={14} color={colors.accent.lime} strokeWidth={2} />
          <AppText variant="subheadlineMedium" color={colors.primary}>
            {stats.currentStreak} Days
          </AppText>
        </View>
      </View>

      <View style={styles.ringContainer}>
        <ProgressRing
          progress={stats.completionPercentage}
          size={120}
          strokeWidth={6}
          color={colors.accent.lime}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <AppText variant="caption" color={colors.tertiary}>
            Study Time
          </AppText>
          <AppText variant="title3" color={colors.primary} style={styles.statValue}>
            {stats.minutesToday}m
          </AppText>
        </View>
        <View style={styles.stat}>
          <AppText variant="caption" color={colors.tertiary}>
            Completed
          </AppText>
          <AppText variant="title3" color={colors.primary} style={styles.statValue}>
            {stats.completionPercentage}%
          </AppText>
        </View>
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  label: {
    marginBottom: 0,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ringContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    marginTop: spacing.xs,
  },
});
