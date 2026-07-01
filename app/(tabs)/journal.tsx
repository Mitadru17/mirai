/**
 * Memory Garden — Learning growth visualization.
 * 
 * A contemplative screen that represents mastered knowledge as growing plants.
 * The visual metaphor reinforces spaced repetition: plants grow taller
 * as retention strengthens, and their stage reflects review status.
 * 
 * This screen does NOT scroll — it is a full-bleed visual experience
 * with overlaid glass stat cards anchored to the bottom.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import Svg, { Line, Circle, Ellipse, Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppCard }     from '../../src/components/ui/AppCard';
import { AppText }     from '../../src/components/ui/AppText';
import { FadeIn }      from '../../src/components/ui/FadeIn';
import { useTheme }    from '../../src/theme/ThemeContext';
import { spacing, layout } from '../../src/theme/spacing';

// ─── Types ────────────────────────────────────────────────────────────────

interface Stem {
  x: number;
  h: number;
  opacity: number;
  stage: 'mature' | 'growing' | 'seedling';
}

interface Particle {
  x: number;
  y: number;
  r: number;
  o: number;
}

// ─── Garden Background ───────────────────────────────────────────────────

const STEM_DATA: Stem[] = [
  { x: 50,  h: 200, opacity: 0.7,  stage: 'mature' },
  { x: 100, h: 280, opacity: 0.9,  stage: 'mature' },
  { x: 140, h: 160, opacity: 0.5,  stage: 'growing' },
  { x: 200, h: 100, opacity: 0.35, stage: 'seedling' },
  { x: 260, h: 240, opacity: 0.8,  stage: 'mature' },
  { x: 310, h: 180, opacity: 0.6,  stage: 'growing' },
  { x: 360, h: 120, opacity: 0.4,  stage: 'seedling' },
];

/**
 * Generate stable particle positions once per mount.
 * Using a seeded approach to avoid Math.random() flicker on re-render.
 */
function generateParticles(screenWidth: number, screenHeight: number): Particle[] {
  const seeds = [0.23, 0.67, 0.41, 0.89, 0.14, 0.55, 0.72, 0.38];
  return seeds.map((seed, i) => ({
    x: 40 + seed * (screenWidth - 80),
    y: screenHeight * 0.3 + ((seed * 7 + i * 0.13) % 1) * (screenHeight * 0.3),
    r: (seed * 1.5) + 0.5,
    o: (seed * 0.25) + 0.05,
  }));
}

function GardenBackground() {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const gardenBottom = height * 0.85;
  const particles = useMemo(() => generateParticles(width, height), [width, height]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        {/* Soft ambient glow at bottom */}
        <Ellipse 
          cx={width / 2} 
          cy={gardenBottom} 
          rx={width * 0.6} 
          ry={120} 
          fill={colors.accent.limeDim} 
          opacity={0.4} 
        />
        
        {STEM_DATA.map((stem, i) => {
          const baseY = gardenBottom;
          const topY = baseY - stem.h;
          const isMature = stem.stage === 'mature';
          const isGrowing = stem.stage === 'growing';
          
          return (
            <React.Fragment key={i}>
              {/* Stem line */}
              <Line
                x1={stem.x}
                y1={baseY}
                x2={stem.x}
                y2={topY}
                stroke={colors.accent.lime}
                strokeWidth={isMature ? 1.5 : 1}
                strokeOpacity={stem.opacity}
                strokeLinecap="round"
              />
              
              {/* Bloom/bud at top — size indicates maturity */}
              {isMature && (
                <>
                  <Circle cx={stem.x} cy={topY} r={4} fill={colors.accent.lime} opacity={stem.opacity} />
                  <Circle cx={stem.x} cy={topY} r={8} fill={colors.accent.lime} opacity={stem.opacity * 0.15} />
                </>
              )}
              {isGrowing && (
                <Circle cx={stem.x} cy={topY} r={3} fill={colors.accent.lime} opacity={stem.opacity * 0.7} />
              )}
              {stem.stage === 'seedling' && (
                <Circle cx={stem.x} cy={topY} r={2} fill={colors.accent.lime} opacity={stem.opacity * 0.5} />
              )}

              {/* Leaves for mature plants only */}
              {isMature && stem.h > 150 && (
                <>
                  <Path
                    d={`M${stem.x} ${topY + 40} C${stem.x - 15} ${topY + 30} ${stem.x - 18} ${topY + 20} ${stem.x - 12} ${topY + 15}`}
                    stroke={colors.accent.lime}
                    strokeWidth={1}
                    strokeOpacity={stem.opacity * 0.6}
                    fill="none"
                    strokeLinecap="round"
                  />
                  <Path
                    d={`M${stem.x} ${topY + 60} C${stem.x + 15} ${topY + 50} ${stem.x + 18} ${topY + 40} ${stem.x + 12} ${topY + 35}`}
                    stroke={colors.accent.lime}
                    strokeWidth={1}
                    strokeOpacity={stem.opacity * 0.6}
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {particles.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={p.r} fill={colors.primary} opacity={p.o} />
        ))}
      </Svg>
    </View>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────

type DotType = 'solid' | 'hollow' | 'quarter';

const StatCard = React.memo(function StatCard({ 
  label, value, color, dotType 
}: { 
  label: string; value: string; color: string; dotType: DotType;
}) {
  const { colors } = useTheme();
  
  return (
    <AppCard variant="glass" padding={spacing.xl} style={s.statCard}>
      <View style={s.statHeader}>
        <View style={s.dotWrap}>
          {dotType === 'solid' && (
            <View style={[s.dot, { backgroundColor: color }]} />
          )}
          {dotType === 'hollow' && (
            <View style={[s.dot, s.dotHollow, { borderColor: color }]} />
          )}
          {dotType === 'quarter' && (
            <View style={[s.dot, s.dotHollow, { borderColor: colors.muted, overflow: 'hidden' }]}>
              <View style={[s.dotQuarterFill, { backgroundColor: color }]} />
            </View>
          )}
        </View>
        <AppText variant="label" color={colors.secondary}>
          {label}
        </AppText>
      </View>
      <AppText
        variant="display"
        color={color}
        style={s.statValue}
        accessibilityLabel={`${label}: ${value}`}
      >
        {value}
      </AppText>
    </AppCard>
  );
});

// ─── Screen ──────────────────────────────────────────────────────────────

export default function GardenScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <GardenBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[
          s.scrollContent,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + layout.tabBarHeight + spacing['3xl'] },
        ]}
      >
        {/* Title area */}
        <View style={s.textOverlay}>
          <FadeIn delay={100} duration={600} translateY={0}>
            <AppText variant="label" color={colors.secondary} style={s.sectionLabel}>
              MEMORY GARDEN
            </AppText>
            <AppText variant="heading" color={colors.primary} style={s.quote}>
              "Focus is the water of the mind."
            </AppText>
          </FadeIn>
        </View>

        {/* Stats Cards — scrollable in case of small screens */}
        <View style={s.cardsContainer}>
          <FadeIn delay={250} duration={500}>
            <StatCard label="MASTERED" value="12" color={colors.accent.lime} dotType="solid" />
          </FadeIn>
          <FadeIn delay={350} duration={500}>
            <StatCard label="LEARNING" value="4" color={colors.primary} dotType="hollow" />
          </FadeIn>
          <FadeIn delay={450} duration={500}>
            <StatCard label="REVIEW NEEDED" value="3" color={colors.secondary} dotType="quarter" />
          </FadeIn>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  textOverlay: {
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing['3xl'],
  },
  sectionLabel: {
    marginBottom: spacing.md,
  },
  quote: {
    letterSpacing: -0.5,
  },
  cardsContainer: {
    paddingHorizontal: layout.screenPaddingH,
    gap: spacing.md,
  },
  statCard: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statValue: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: -2,
    lineHeight: 56,
  },

  // Dot indicators — unified base style
  dotWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotHollow: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  dotQuarterFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
  },
});
