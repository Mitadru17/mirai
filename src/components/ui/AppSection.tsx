/**
 * AppSection — Minimal section with breathing room.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { AppText } from './AppText';
import { AnimatedPressable } from './AnimatedPressable';
import { useColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';

interface AppSectionProps {
  title?:    string;
  subtitle?: string;
  action?:   { label: string; onPress: () => void };
  children:  React.ReactNode;
  style?:    StyleProp<ViewStyle>;
}

export function AppSection({
  title,
  subtitle,
  action,
  children,
  style,
}: AppSectionProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, style]}>
      {(title || action) && (
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            {title && (
              <AppText variant="title3" color={colors.primary}>
                {title}
              </AppText>
            )}
            {subtitle && (
              <AppText
                variant="footnote"
                color={colors.secondary}
                style={styles.subtitle}
              >
                {subtitle}
              </AppText>
            )}
          </View>
          {action && (
            <AnimatedPressable onPress={action.onPress}>
              <AppText variant="subheadline" color={colors.accent.lime}>
                {action.label}
              </AppText>
            </AnimatedPressable>
          )}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing['2xl'],
  },
  header: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    marginBottom:   spacing.base,
  },
  titleGroup: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
});
