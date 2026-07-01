/**
 * LaunchScreen — Mirai's opening animation.
 * Sprout mark appears, breathes, then transitions to app.
 * Duration: ~1.3 seconds. Quiet. Confident.
 */

import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useColors } from '../../theme/ThemeContext';
import { AppText } from '../ui/AppText';
import { animations } from '../../theme/animations';

interface LaunchScreenProps {
  onComplete: () => void;
}

// Minimal sprouting leaf mark — geometric, timeless
function SproutMark({ color, size = 56 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Stem */}
      <Path
        d="M28 48 L28 24"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <Path
        d="M28 32 C28 32 18 28 16 20 C20 20 28 24 28 32Z"
        fill={color}
        opacity="0.85"
      />
      {/* Right leaf */}
      <Path
        d="M28 28 C28 28 38 24 40 16 C36 16 28 20 28 28Z"
        fill={color}
      />
      {/* Root circle */}
      <Circle cx="28" cy="48" r="2.5" fill={color} opacity="0.4" />
    </Svg>
  );
}

export function LaunchScreen({ onComplete }: LaunchScreenProps) {
  const colors = useColors();
  const [reduceMotion, setReduceMotion] = useState(false);

  // Shared values
  const markOpacity   = useSharedValue(0);
  const markScale     = useSharedValue(0.82);
  const textOpacity   = useSharedValue(0);
  const textTranslate = useSharedValue(6);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (isMounted) {
        setReduceMotion(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const revealDuration = reduceMotion ? 1 : 500;
    const textDelay = reduceMotion ? 0 : 300;
    const textDuration = reduceMotion ? 1 : 420;
    const dismissDelay = reduceMotion ? 380 : 1100;
    const dismissDuration = reduceMotion ? 180 : 300;

    // 1. Sprout mark fades + scales in
    markOpacity.value = withTiming(1, { duration: revealDuration, easing: animations.easing.easeOut });
    markScale.value   = reduceMotion ? 1 : withSpring(1, animations.spring.launch);

    // 2. Name appears below mark
    textOpacity.value   = withDelay(textDelay, withTiming(1,  { duration: textDuration, easing: animations.easing.easeOut }));
    textTranslate.value = withDelay(textDelay, withTiming(0,  { duration: textDuration, easing: animations.easing.easeOut }));

    // 3. Whole screen fades out → onComplete
    const dismiss = () => {
      screenOpacity.value = withTiming(0, { duration: dismissDuration, easing: animations.easing.easeIn }, (done) => {
        if (done) runOnJS(onComplete)();
      });
    };

    const timer = setTimeout(dismiss, dismissDelay);
    return () => clearTimeout(timer);
  }, [reduceMotion, markOpacity, markScale, textOpacity, textTranslate, screenOpacity, onComplete]);

  const markStyle   = useAnimatedStyle(() => ({ opacity: markOpacity.value, transform: [{ scale: markScale.value }] }));
  const textStyle   = useAnimatedStyle(() => ({ opacity: textOpacity.value, transform: [{ translateY: textTranslate.value }] }));
  const screenStyle = useAnimatedStyle(() => ({ opacity: screenOpacity.value }));

  return (
    <Animated.View style={[styles.container, { backgroundColor: colors.background }, screenStyle]}>
      <View style={styles.center}>
        <Animated.View style={markStyle}>
          <SproutMark color={colors.accent.lime} size={52} />
        </Animated.View>
        <Animated.View style={[styles.nameRow, textStyle]}>
          <AppText
            variant="title2"
            color={colors.primary}
            style={styles.appName}
          >
            mirai
          </AppText>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems:     'center',
    zIndex:         999,
  },
  center: {
    alignItems: 'center',
    gap:        20,
  },
  nameRow: {
    alignItems: 'center',
  },
  appName: {
    letterSpacing: 4,
    opacity:       0.9,
  },
});
