/**
 * Insight Card
 * Shows personalized, rotating insights.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { AppCard, AppText } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout } from '../../../src/theme/spacing';
import { useInsight } from '../hooks/useRotatingContent';

export function InsightCard() {
  const colors = useColors();
  const insight = useInsight();

  return (
    <AppCard padding={spacing.xl} variant="surface" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Sparkles size={16} color={colors.accent.lime} strokeWidth={1.5} />
        </View>
        <AppText variant="label" color={colors.secondary}>
          INSIGHT
        </AppText>
      </View>
      
      <AppText variant="subheadline" color={colors.primary}>
        {insight}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(190,255,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
