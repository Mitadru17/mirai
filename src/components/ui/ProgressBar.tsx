/**
 * ProgressBar — Animated, theme-aware.
 * Refined height, improved track contrast, smoother animation.
 */

import React, { useEffect } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '../../theme/ThemeContext';
import { animations } from '../../theme/animations';

interface ProgressBarProps {
  progress:    number;   // 0–1
  color?:      string;
  trackColor?: string;
  height?:     number;
  style?:      StyleProp<ViewStyle>;
  animated?:   boolean;
  accessibilityLabel?: string;
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  height   = 6,           // Increased from 4 for better visibility
  style,
  animated = true,
  accessibilityLabel,
}: ProgressBarProps) {
  const colors = useColors();
  const fill   = color      ?? colors.accent.lime;
  const track  = trackColor ?? colors.cardAlt;   // Better contrast than surface

  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    animatedWidth.value = animated
      ? withTiming(clamped, { duration: animations.timing.slow, easing: animations.easing.easeOut })
      : clamped;
  }, [progress, animated, animatedWidth]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  return (
    <View
      style={[
        {
          backgroundColor: track,
          height,
          borderRadius: height,
          overflow: 'hidden',
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? 'Progress'}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      <Animated.View
        style={[
          { backgroundColor: fill, height, borderRadius: height },
          fillStyle,
        ]}
      />
    </View>
  );
}
