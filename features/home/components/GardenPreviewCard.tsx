/**
 * Garden Preview Card
 * Shows garden health and growth status.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { AppCard, AppText, AppButton } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout, radius } from '../../../src/theme/spacing';
import type { GardenData } from '../types';

interface GardenPreviewCardProps {
  garden: GardenData;
}

function PlantIcon({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Path d="M20 38 V18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M20 30 C12 25 10 16 10 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Path d="M20 26 C28 21 30 12 30 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="20" cy="14" r="2.5" fill={color} opacity={0.9} />
      <Circle cx="9" cy="14" r="2" fill={color} opacity={0.6} />
      <Circle cx="31" cy="10" r="2" fill={color} opacity={0.6} />
    </Svg>
  );
}

export function GardenPreviewCard({ garden }: GardenPreviewCardProps) {
  const colors = useColors();
  const router = useRouter();

  const handleViewGarden = () => {
    router.push('/(tabs)/journal');
  };

  return (
    <AppCard padding={spacing.xl} style={styles.card}>
      <AppText variant="label" color={colors.secondary} style={styles.label}>
        GARDEN
      </AppText>

      <View style={styles.content}>
        <View style={styles.plantWrapper}>
          <PlantIcon color={colors.accent.lime} size={36} />
        </View>
        
        <View style={styles.info}>
          <View style={styles.statRow}>
            <AppText variant="subheadlineMedium" color={colors.primary}>
              {garden.health}% Health
            </AppText>
            <AppText variant="caption" color={colors.tertiary}>
              •
            </AppText>
            <AppText variant="caption" color={colors.secondary}>
              {garden.growth}% Growth
            </AppText>
          </View>
          <AppText variant="caption" color={colors.tertiary} style={styles.plantType}>
            {garden.plantType}
          </AppText>
        </View>
      </View>

      <AppButton
        title="View Garden"
        variant="ghost"
        size="sm"
        onPress={handleViewGarden}
        style={styles.button}
        accessibilityLabel="View your learning garden"
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  label: {
    marginBottom: spacing.base,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  plantWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(190,255,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  plantType: {
    marginTop: spacing.xs,
  },
  button: {
    borderRadius: radius.lg,
  },
});
