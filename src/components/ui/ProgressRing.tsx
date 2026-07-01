/**
 * ProgressRing — Circular progress indicator with center label.
 * Refined sizing, glow effect, and smooth animation.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { AppText } from './AppText';
import { useColors } from '../../theme/ThemeContext';
import { animations } from '../../theme/animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  /** 0–100 */
  progress:    number;
  /** Outer size of the ring */
  size?:       number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Fill color */
  color?:      string;
  /** Whether to show the percentage label */
  showLabel?:  boolean;
  /** Whether to animate on mount */
  animated?:   boolean;
}

export function ProgressRing({
  progress,
  size        = 140,
  strokeWidth = 8,
  color,
  showLabel   = true,
  animated    = true,
}: ProgressRingProps) {
  const colors = useColors();
  const fill   = color ?? colors.accent.lime;

  const center = size / 2;
  const r      = center - strokeWidth;
  const circumference = 2 * Math.PI * r;

  const animProgress = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 0), 100);
    animProgress.value = animated
      ? withTiming(clamped, { duration: 800, easing: animations.easing.easeOut })
      : clamped;
  }, [progress, animated, animProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (animProgress.value / 100) * circumference,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          stroke="rgba(255,255,255,0.06)"
          cx={center}
          cy={center}
          r={r}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fill */}
        <AnimatedCircle
          stroke={fill}
          cx={center}
          cy={center}
          r={r}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {showLabel && (
        <View style={[StyleSheet.absoluteFill, styles.label]}>
          <AppText
            variant="heading"
            color={colors.primary}
            style={styles.labelText}
          >
            {Math.round(progress)}%
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  label: {
    alignItems:     'center',
    justifyContent: 'center',
  },
  labelText: {
    fontWeight:     '700',
    letterSpacing:  -1.5,
  },
});
