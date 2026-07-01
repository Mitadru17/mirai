/**
 * Mirai Color System — LOCKED
 * Muted lime green accent on jet black.
 * Predominantly monochrome. Green = growth, progress, success.
 *
 * Refined for production: improved tonal hierarchy, better contrast ratios,
 * and cleaner overlay/glass values.
 */

export const darkColors = {
  // Backgrounds — graduated tonal ramp
  background:    '#000000',
  surface:       '#0A0A0A',
  card:          '#111111',
  cardAlt:       '#161616',
  cardElevated:  '#1A1A1A',

  // Text — improved contrast ratios for readability
  primary:       '#FFFFFF',
  secondary:     '#8E8E93',     // iOS secondary label gray (better contrast than #888)
  tertiary:      '#636366',     // iOS tertiary label
  muted:         '#3A3A3C',     // iOS quaternary label
  placeholder:   '#2C2C2E',

  // Borders — consistent opacity scale
  border:        '#1E1E1E',
  borderSubtle:  '#161616',
  borderAccent:  'rgba(190,255,0,0.10)',
  divider:       '#1A1A1A',

  // Accent — muted lime green
  accent: {
    lime:        '#BEFF00',
    limeLight:   '#D4FF4D',
    limeMuted:   'rgba(190,255,0,0.12)',
    limeDim:     'rgba(190,255,0,0.06)',
    limeGlow:    'rgba(190,255,0,0.18)',
    limeText:    '#BEFF00',
  },

  // Status
  status: {
    success:     '#BEFF00',
    warning:     '#FFD60A',
    error:       '#FF453A',
  },

  // Overlays — refined glass/blur values
  overlay:       'rgba(0,0,0,0.6)',
  scrim:         'rgba(0,0,0,0.85)',
  glassCard:     'rgba(17,17,17,0.75)',
  glassBorder:   'rgba(255,255,255,0.08)',
  transparent:   'transparent',
  white:         '#FFFFFF',
  black:         '#000000',
} as const;

export const lightColors = {
  background:    '#FAF9F6',
  surface:       '#F2F1ED',
  card:          '#FFFFFF',
  cardAlt:       '#F7F6F2',
  cardElevated:  '#FFFFFF',

  primary:       '#111111',
  secondary:     '#6B6B6B',
  tertiary:      '#9B9B9B',
  muted:         '#C4C4C4',
  placeholder:   '#E5E5E5',

  border:        '#E5E5E5',
  borderSubtle:  '#EFEFEF',
  borderAccent:  'rgba(120,180,0,0.10)',
  divider:       '#EBEBEB',

  accent: {
    lime:        '#6B9020',
    limeLight:   '#8DB830',
    limeMuted:   'rgba(107,144,32,0.12)',
    limeDim:     'rgba(107,144,32,0.05)',
    limeGlow:    'rgba(107,144,32,0.15)',
    limeText:    '#5A7A1A',
  },

  status: {
    success:     '#5E8E20',
    warning:     '#B8922A',
    error:       '#B3514A',
  },

  overlay:       'rgba(0,0,0,0.35)',
  scrim:         'rgba(0,0,0,0.6)',
  glassCard:     'rgba(255,255,255,0.8)',
  glassBorder:   'rgba(0,0,0,0.06)',
  transparent:   'transparent',
  white:         '#FFFFFF',
  black:         '#000000',
} as const;

export const colors = darkColors;
export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof darkColors;
