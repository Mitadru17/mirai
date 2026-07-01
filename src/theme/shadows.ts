/**
 * Mirai Shadows — Minimal, purposeful depth.
 * Only applied where they genuinely improve hierarchy.
 */

import { Platform, ViewStyle } from 'react-native';

function iosShadow(
  opacity: number,
  radius: number,
  offsetY: number,
  color = '#000000'
): ViewStyle {
  if (Platform.OS !== 'ios') return { elevation: Math.round(radius / 2) };
  return {
    shadowColor:   color,
    shadowOffset:  { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius:  radius,
  };
}

export const shadows = {
  none: {} as ViewStyle,

  // Subtle card lift
  sm: iosShadow(0.08, 4, 2),

  // Standard card shadow
  md: iosShadow(0.12, 10, 4),

  // Elevated panels
  lg: iosShadow(0.16, 20, 8),

  // Sheet / modal
  sheet: iosShadow(0.24, 32, 12),
} as const;
