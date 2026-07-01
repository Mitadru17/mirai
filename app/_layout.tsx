/**
 * Mirai Root Layout
 * Font loading → DB init → Launch animation → App
 * Smoother transitions, improved animation config.
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { initializeDatabase } from '../src/services/database';
import { useAppStore } from '../src/stores/appStore';
import { hydrateProgress } from '../src/stores/progressStore';
import { LaunchScreen } from '../src/components/launch/LaunchScreen';

import '../global.css';

SplashScreen.preventAutoHideAsync();

function StartupFallback() {
  return (
    <View style={styles.startupFallback}>
      <ActivityIndicator size="small" color="#BEFF00" />
    </View>
  );
}

function AppCore() {
  const { isDark, colors } = useTheme();
  const [showLaunch, setShowLaunch] = useState(true);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown:  false,
          contentStyle: { backgroundColor: colors.background },
          animation:    'fade',
          animationDuration: 240,
        }}
      />
      {showLaunch && (
        <LaunchScreen onComplete={() => setShowLaunch(false)} />
      )}
    </>
  );
}

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const setDbInitialized = useAppStore((s) => s.setDbInitialized);
  const setReady         = useAppStore((s) => s.setReady);

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    async function prepare() {
      try {
        await initializeDatabase();
        setDbInitialized(true);
        await hydrateProgress();
        setReady(true);
      } catch (e) {
        console.warn('Init error:', e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded, setDbInitialized, setReady]);

  if (!appReady) return <StartupFallback />;

  return (
    <GestureHandlerRootView style={styles.fill}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppCore />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  startupFallback: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
