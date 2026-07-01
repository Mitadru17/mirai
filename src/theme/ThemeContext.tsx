/**
 * Mirai Theme Context
 * Provides theme-aware colors to all components.
 * Follows system appearance and allows manual override.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ThemeColors, type ColorScheme } from './colors';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'dark',
  colors: darkColors,
  isDark: true,
  toggleTheme: () => {},
  setScheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [manualScheme, setManualScheme] = useState<ColorScheme | null>(null);

  const scheme: ColorScheme = manualScheme ?? (systemScheme === 'light' ? 'light' : 'dark');
  const isDark = scheme === 'dark';
  const themeColors = isDark ? darkColors : (lightColors as unknown as ThemeColors);

  const toggleTheme = () => {
    setManualScheme(isDark ? 'light' : 'dark');
  };

  const setScheme = (s: ColorScheme) => setManualScheme(s);

  return (
    <ThemeContext.Provider value={{ scheme, colors: themeColors, isDark, toggleTheme, setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

// Convenience hook for just colors
export function useColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}
