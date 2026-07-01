/**
 * AnimatedPressable — Precision spring press with haptic feedback.
 * Consistent touch target sizing (minimum 44pt per Apple HIG).
 */

import React, { useCallback } from 'react';
import { Pressable, ViewStyle, StyleProp, AccessibilityRole } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { animations } from '../../theme/animations';

interface AnimatedPressableProps {
  onPress?:          () => void;
  onLongPress?:      () => void;
  style?:            StyleProp<ViewStyle>;
  scaleValue?:       number;
  haptic?:           boolean;
  hapticStyle?:      Haptics.ImpactFeedbackStyle;
  disabled?:         boolean;
  children:          React.ReactNode;
  accessibilityRole?:    AccessibilityRole;
  accessibilityLabel?:   string;
}

export function AnimatedPressable({
  onPress,
  onLongPress,
  style,
  scaleValue = animations.scale.pressed,
  haptic     = true,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  disabled    = false,
  children,
  accessibilityRole,
  accessibilityLabel,
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleValue, animations.spring.micro);
  }, [scale, scaleValue]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, animations.spring.gentle);
  }, [scale]);

  const handlePress = useCallback(() => {
    if (haptic) Haptics.impactAsync(hapticStyle);
    onPress?.();
  }, [haptic, hapticStyle, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessibilityRole={accessibilityRole ?? (onPress ? 'button' : undefined)}
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
