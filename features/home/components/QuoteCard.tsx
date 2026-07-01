/**
 * Quote Card
 * Shows calm, rotating quotes with subtle styling.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme/spacing';
import { useQuote } from '../hooks/useRotatingContent';

export function QuoteCard() {
  const colors = useColors();
  const quote = useQuote();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.accent.limeDim }]} />
      <AppText variant="callout" color={colors.tertiary} style={styles.quote}>
        "{quote}"
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  line: {
    width: 24,
    height: 2,
    borderRadius: 1,
    marginBottom: spacing.base,
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
