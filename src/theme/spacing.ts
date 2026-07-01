/**
 * Mirai Spacing & Layout Tokens
 * Generous spacing — every screen should breathe.
 * Based on a 4-point grid for optical consistency.
 */

export const spacing = {
  '2xs':  2,
  xs:     4,
  sm:     8,
  md:    12,
  base:  16,
  lg:    20,
  xl:    24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 56,
  '6xl': 72,
  '7xl': 96,
} as const;

export const radius = {
  none:  0,
  xs:    4,
  sm:    8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl':24,
  '3xl':32,
  full: 9999,
} as const;

export const layout = {
  screenPaddingH:  24,    // Generous horizontal margin
  screenPaddingV:  20,
  sectionGap:      32,    // Section breathing room (was 36 — tighter for mobile)
  cardGap:         16,    // Consistent card gap
  cardPadding:     20,    // Default card inner padding
  cardPaddingLg:   24,    // Larger card inner padding
  headerPaddingV:  16,
  tabBarHeight:    72,
  maxContentWidth: 428,
} as const;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey  = keyof typeof radius;
