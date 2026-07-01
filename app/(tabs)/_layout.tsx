/**
 * Mirai Tab Layout — Floating Capsule Navigation.
 * Refined glass material, improved active indicator, smoother transitions.
 * 
 * Now with 5 tabs: Home, Journey, Practice, Garden, Profile.
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { 
  LayoutGrid, 
  TrendingUp, 
  Code2, 
  Sprout, 
  User 
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeContext';
import { spacing } from '../../src/theme/spacing';

const ICON_SIZE = 20;
const ICON_STROKE = 1.5;
const ICON_STROKE_ACTIVE = 2;

interface TabIconProps {
  Icon:    React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  focused: boolean;
}

function TabIcon({ Icon, focused }: TabIconProps) {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.iconWrap,
        focused && { backgroundColor: colors.accent.lime },
      ]}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
    >
      <Icon 
        size={ICON_SIZE} 
        color={focused ? colors.background : colors.tertiary} 
        strokeWidth={focused ? ICON_STROKE_ACTIVE : ICON_STROKE} 
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 20),
          left: spacing.xl,
          right: spacing.xl,
          height: 68,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, styles.capsuleShadow]}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 90 : 80}
              tint={Platform.OS === 'ios' ? 'systemThickMaterialDark' : 'dark'}
              experimentalBlurMethod="dimezisBlurView"
              style={[
                StyleSheet.absoluteFill,
                { 
                  borderRadius: 34, 
                  borderWidth: 1, 
                  borderColor: 'rgba(255,255,255,0.10)',
                  backgroundColor: Platform.OS === 'android' ? 'rgba(15,15,15,0.90)' : 'rgba(15,15,15,0.25)',
                  overflow: 'hidden',
                },
              ]}
            />
          </View>
        ),
      }}
      screenListeners={{
        tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={LayoutGrid} focused={focused} />,
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={TrendingUp} focused={focused} />,
          tabBarAccessibilityLabel: 'Journey',
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Code2} focused={focused} />,
          tabBarAccessibilityLabel: 'Practice',
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={Sprout} focused={focused} />,
          tabBarAccessibilityLabel: 'Garden',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
          tabBarAccessibilityLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
});
