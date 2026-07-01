/**
 * AppCard — Dark charcoal cards with optional green glow border.
 * Consistent corner radius, elevation, and border opacity across all variants.
 */

import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { useColors } from '../../theme/ThemeContext';
import { radius, layout } from '../../theme/spacing';

interface AppCardProps {
  children:  React.ReactNode;
  style?:    StyleProp<ViewStyle>;
  onPress?:  () => void;
  variant?:  'default' | 'glow' | 'surface' | 'flat' | 'glass';
  padding?:  number;
  /** Accessible label for screen readers */
  accessibilityLabel?: string;
}

export function AppCard({
  children,
  style,
  onPress,
  variant = 'default',
  padding = layout.cardPadding,
  accessibilityLabel,
}: AppCardProps) {
  const colors = useColors();

  const bg =
    variant === 'surface' ? colors.surface :
    variant === 'flat'    ? colors.background :
    variant === 'glass'   ? colors.glassCard :
    colors.card;

  const borderColor =
    variant === 'glow' ? colors.borderAccent :
    variant === 'glass' ? colors.glassBorder :
    colors.borderSubtle;

  const cardStyle: ViewStyle = {
    backgroundColor: bg,
    padding,
    borderRadius:    radius.xl,   // Unified: 20px across all cards
    borderWidth:     1,
    borderColor,
    overflow:        'hidden',    // Prevent child content from bleeding past radius
  };

  const inner = (
    <View
      style={[cardStyle, style]}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable onPress={onPress} accessibilityRole="button">
        {inner}
      </AnimatedPressable>
    );
  }

  return inner;
}
