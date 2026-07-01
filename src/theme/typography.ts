/**
 * Mirai Typography System
 * DM Sans for headings, SF Pro (System) for body.
 * Generous line spacing, precise hierarchy.
 *
 * Refined: improved line-height ratios, tighter letter-spacing
 * for display sizes, better caption/label readability.
 */

import { Platform, TextStyle } from 'react-native';

// Body text: use system font (SF Pro on iOS) for native feel
const systemFont = Platform.select({
  ios: undefined,       // undefined = use iOS system font (SF Pro)
  android: undefined,
  default: undefined,
});

// Display/heading font: DM Sans (loaded via expo-font)
const displayFont = Platform.select({
  ios: 'DMSans_600SemiBold',
  android: 'DMSans_600SemiBold',
  default: 'DMSans_600SemiBold',
});

const displayFontBold = Platform.select({
  ios: 'DMSans_700Bold',
  android: 'DMSans_700Bold',
  default: 'DMSans_700Bold',
});

const displayFontMedium = Platform.select({
  ios: 'DMSans_500Medium',
  android: 'DMSans_500Medium',
  default: 'DMSans_500Medium',
});

export const typography: Record<string, TextStyle> = {
  // --- Display hierarchy ---
  display: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
    fontFamily: displayFontBold,
    letterSpacing: -0.8,
  },
  heading: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600',
    fontFamily: displayFont,
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: displayFont,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '600',
    fontFamily: displayFont,
    letterSpacing: -0.2,
  },
  title3: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: displayFont,
    letterSpacing: -0.1,
  },

  // --- Body hierarchy ---
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: systemFont,
    letterSpacing: -0.2,
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    fontFamily: systemFont,
    letterSpacing: -0.2,
  },
  callout: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: systemFont,
    letterSpacing: -0.15,
  },
  subheadline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    fontFamily: systemFont,
    letterSpacing: -0.1,
  },
  subheadlineMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: systemFont,
    letterSpacing: -0.1,
  },

  // --- Small hierarchy ---
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    fontFamily: systemFont,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    fontFamily: systemFont,
    letterSpacing: 0.2,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    fontFamily: systemFont,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    fontFamily: displayFontMedium,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
} as const;

export type TypographyVariant = keyof typeof typography;
