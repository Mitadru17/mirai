/**
 * AppScreen — Base screen wrapper with theme-aware background.
 * Handles safe area insets, scrolling, and consistent padding.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../../theme/ThemeContext';
import { layout, spacing } from '../../theme/spacing';

interface AppScreenProps {
  children:    React.ReactNode;
  style?:      StyleProp<ViewStyle>;
  scrollable?: boolean;
  padded?:     boolean;
  edges?:      ('top' | 'bottom' | 'left' | 'right')[];
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function AppScreen({
  children,
  style,
  scrollable = false,
  padded     = true,
  edges      = ['top'],
  contentContainerStyle,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop:    edges.includes('top')    ? insets.top    : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft:   edges.includes('left')   ? insets.left   : 0,
    paddingRight:  edges.includes('right')  ? insets.right  : 0,
  };

  if (scrollable) {
    return (
      <View style={[containerStyle, style]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          overScrollMode="never"
          bounces={true}
          contentContainerStyle={[
            {
              paddingHorizontal: padded ? layout.screenPaddingH : 0,
              paddingBottom: layout.tabBarHeight + insets.bottom + spacing['4xl'],
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      style={[
        containerStyle,
        padded && { paddingHorizontal: layout.screenPaddingH },
        style,
      ]}
    >
      {children}
    </View>
  );
}
