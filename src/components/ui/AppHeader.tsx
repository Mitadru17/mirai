/**
 * AppHeader — Large-title header. Typography-led.
 * Consistent padding with the spacing system.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { useColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';

interface AppHeaderProps {
  title:        string;
  subtitle?:    string;
  rightAction?: React.ReactNode;
  leftAction?:  React.ReactNode;
  compact?:     boolean;
}

export function AppHeader({
  title,
  subtitle,
  rightAction,
  leftAction,
  compact = false,
}: AppHeaderProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {(leftAction || rightAction) && (
        <View style={styles.actions}>
          <View style={styles.left}>{leftAction}</View>
          <View style={styles.right}>{rightAction}</View>
        </View>
      )}
      <View style={styles.titleBlock}>
        <AppText
          variant={compact ? 'title' : 'display'}
          color={colors.primary}
          style={compact ? styles.compactTitle : styles.displayTitle}
          accessibilityRole="header"
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            variant="subheadline"
            color={colors.secondary}
            style={styles.subtitle}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:    spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  compactContainer: {
    paddingTop:    spacing.base,
    paddingBottom: spacing.lg,
  },
  actions: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   spacing.lg,
  },
  left:  {},
  right: {},
  titleBlock: {},
  displayTitle: {
    letterSpacing: -1,
  },
  compactTitle: {},
  subtitle: {
    marginTop: spacing.sm,
  },
});
