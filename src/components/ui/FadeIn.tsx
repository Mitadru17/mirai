/**
 * FadeIn — Entrance animation: fade + upward drift.
 * Respects reduced motion accessibility preference.
 */

import React, { useEffect } from 'react';
import { ViewStyle, StyleProp, AccessibilityInfo } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { animations } from '../../theme/animations';

interface FadeInProps {
  children:    React.ReactNode;
  delay?:      number;
  duration?:   number;
  translateY?: number;
  style?:      StyleProp<ViewStyle>;
}

export function FadeIn({
  children,
  delay      = 0,
  duration   = animations.timing.entrance,
  translateY = 10,
  style,
}: FadeInProps) {
  const opacity   = useSharedValue(0);
  const translate = useSharedValue(translateY);

  useEffect(() => {
    const cfg = { duration, easing: animations.easing.easeOut };
    opacity.value   = withDelay(delay, withTiming(1, cfg));
    translate.value = withDelay(delay, withTiming(0, cfg));
  }, [delay, duration, opacity, translate, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translate.value }],
  }));

  return (
    <Animated.View style={[style, animStyle]}>
      {children}
    </Animated.View>
  );
}
