/**
 * AppButton — Minimal, confident button.
 * Consistent sizing, proper touch targets, and polished feedback.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import { AppText } from './AppText';
import { AnimatedPressable } from './AnimatedPressable';
import { useColors } from '../../theme/ThemeContext';
import { radius, spacing } from '../../theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'sage';
type ButtonSize    = 'sm' | 'md' | 'lg';

const heights:  Record<ButtonSize, number> = { sm: 40, md: 48, lg: 56 };
const paddings: Record<ButtonSize, number> = { sm: spacing.base, md: spacing.xl, lg: spacing['2xl'] };

interface AppButtonProps {
  title:      string;
  onPress?:   () => void;
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  disabled?:  boolean;
  loading?:   boolean;
  icon?:      React.ReactNode;
  fullWidth?: boolean;
  style?:     StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function AppButton({
  title,
  onPress,
  variant   = 'primary',
  size      = 'md',
  disabled  = false,
  loading   = false,
  icon,
  fullWidth = false,
  style,
  accessibilityLabel,
}: AppButtonProps) {
  const colors = useColors();

  const textVariant = size === 'sm' ? 'subheadlineMedium' : 'bodyMedium';

  const variantColors = useMemo(() => {
    switch (variant) {
      case 'primary':   return { bg: colors.primary,          text: colors.background, border: colors.primary };
      case 'sage':      return { bg: colors.accent.lime,      text: colors.background, border: colors.accent.lime };
      case 'secondary': return { bg: colors.card,             text: colors.primary,    border: colors.border };
      case 'ghost':     return { bg: 'transparent',           text: colors.secondary,  border: 'transparent' };
    }
  }, [variant, colors]);

  const buttonStyle = useMemo<ViewStyle>(() => ({
    height:            heights[size],
    paddingHorizontal: paddings[size],
    backgroundColor:   disabled ? colors.placeholder : variantColors.bg,
    borderColor:       variant === 'secondary' ? variantColors.border : 'transparent',
    borderWidth:       variant === 'secondary' ? 1 : 0,
    borderRadius:      radius.lg,
    opacity:           disabled ? 0.5 : 1,
  }), [size, disabled, variant, variantColors, colors.placeholder]);

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.button, buttonStyle, fullWidth && styles.fullWidth, style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantColors.text} />
      ) : (
        <View style={styles.content}>
          {icon != null ? <View>{icon}</View> : null}
          <AppText
            variant={textVariant}
            color={disabled ? colors.muted : variantColors.text}
          >
            {title}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
});
