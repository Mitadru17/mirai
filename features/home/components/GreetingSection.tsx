/**
 * Greeting Section
 * Time-based greeting with rotating message.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing } from '../../../src/theme/spacing';
import { useGreetingData } from '../hooks/useRotatingContent';
import { useAppStore } from '../../../src/stores/appStore';

export function GreetingSection() {
  const colors = useColors();
  const userName = useAppStore((s) => s.userName);
  const { greeting, message } = useGreetingData();

  return (
    <View style={styles.container}>
      <AppText variant="title2" color={colors.primary} style={styles.greeting}>
        {greeting}, {userName}.
      </AppText>
      <AppText variant="subheadline" color={colors.secondary}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
  },
  greeting: {
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
});
