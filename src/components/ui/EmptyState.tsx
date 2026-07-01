/**
 * EmptyState — Quiet, elegant empty states.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { useColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';

interface EmptyStateProps {
  icon?:    React.ReactNode;
  title:    string;
  message:  string;
  action?:  { label: string; onPress: () => void };
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <AppText
        variant="title3"
        color={colors.primary}
        align="center"
        style={styles.title}
      >
        {title}
      </AppText>
      <AppText
        variant="subheadline"
        color={colors.secondary}
        align="center"
        style={styles.message}
      >
        {message}
      </AppText>
      {action && (
        <AppButton
          title={action.label}
          onPress={action.onPress}
          variant="secondary"
          size="sm"
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical:   spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
    alignItems:        'center',
  },
  icon: {
    marginBottom: spacing.xl,
    opacity:      0.4,
  },
  title: {
    marginBottom: spacing.sm,
  },
  message: {
    maxWidth:     280,
    marginBottom: spacing['2xl'],
  },
  button: {},
});
