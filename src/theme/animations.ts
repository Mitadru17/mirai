/**
 * Mirai Animation Presets
 * Fluid, 60fps-first motion language.
 */

import { Easing } from 'react-native-reanimated';

export const animations = {
  timing: {
    instant:       100,
    fast:          180,
    normal:        280,
    slow:          420,
    entrance:      520,
    launch:        1200,
    pageTransition:320,
  },

  easing: {
    // iOS-style ease
    default:   Easing.bezier(0.25, 0.1, 0.25, 1),
    // Decelerate into position
    easeOut:   Easing.bezier(0.0,  0.0,  0.2,  1),
    // Accelerate away
    easeIn:    Easing.bezier(0.4,  0.0,  1.0,  1),
    // Standard material
    smooth:    Easing.bezier(0.4,  0.0,  0.2,  1),
    // Gentle overshoot
    expressive:Easing.bezier(0.34, 1.20, 0.64, 1),
  },

  spring: {
    // Barely perceptible — button presses
    micro: {
      damping:   28,
      stiffness: 400,
      mass:      0.6,
    },
    // Gentle settle — card entrances
    gentle: {
      damping:   22,
      stiffness: 180,
      mass:      1.0,
    },
    // Crisp response — navigation
    snappy: {
      damping:   26,
      stiffness: 320,
      mass:      0.8,
    },
    // Soft bounce — launch elements
    launch: {
      damping:   18,
      stiffness: 120,
      mass:      1.2,
    },
  },

  scale: {
    pressed:  0.97,
    subtle:   0.985,
  },
} as const;
