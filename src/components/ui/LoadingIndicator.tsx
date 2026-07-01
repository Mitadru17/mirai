/**
 * LoadingIndicator — Three dots, breathing rhythm.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { AppText } from './AppText';
import { useColors } from '../../theme/ThemeContext';
import { spacing } from '../../theme/spacing';

interface LoadingIndicatorProps {
  message?: string;
  size?:    'small' | 'large';
}

function Dot({ index }: { index: number }) {
  const colors  = useColors();
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      index * 160,
      withRepeat(
        withSequence(
          withTiming(1,   { duration: 400 }),
          withTiming(0.2, { duration: 400 })
        ),
        -1
      )
    );
  }, [index, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent.lime },
        style,
      ]}
    />
  );
}

export function LoadingIndicator({ message, size = 'large' }: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => <Dot key={i} index={i} />)}
      </View>
      {message && size === 'large' && (
        <AppText variant="footnote" style={styles.msg}>
          {message}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
    gap:            spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap:           spacing.md,
  },
  msg: {
    opacity: 0.5,
  },
});
