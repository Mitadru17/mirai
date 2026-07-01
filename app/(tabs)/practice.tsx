/**
 * Practice — Daily challenges and problem sets.
 * Audit fixes:
 *  1. Daily challenge card spacing improved
 *  2. Difficulty chips properly sized with better contrast
 *  3. Practice area cards — consistent icon sizing
 *  4. Progress numbers aligned
 *  5. All text readable (not too small/faint)
 *  6. Section spacing consistent
 *  7. Recent problems with better padding
 *  8. Difficulty badges with better contrast
 *  9. Bottom nav active state — more motion/feedback
 * 10. Cards elevation consistent
 * 11. Overall screen not compressed
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Zap, Trophy, ArrowRight,
  Brackets, TreePine, Layers, Hash
} from 'lucide-react-native';
import { AppScreen }        from '../../src/components/ui/AppScreen';
import { AppCard }          from '../../src/components/ui/AppCard';
import { AppText }          from '../../src/components/ui/AppText';
import { AppButton }        from '../../src/components/ui/AppButton';
import { ProgressBar }      from '../../src/components/ui/ProgressBar';
import { FadeIn }           from '../../src/components/ui/FadeIn';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { useTheme }         from '../../src/theme/ThemeContext';
import { spacing, radius, layout } from '../../src/theme/spacing';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const difficultyColors: Record<Difficulty, { bg: string; text: string }> = {
  Easy:   { bg: 'rgba(190,255,0,0.10)',  text: '#BEFF00' },
  Medium: { bg: 'rgba(255,214,10,0.10)', text: '#FFD60A' },
  Hard:   { bg: 'rgba(255,69,58,0.10)',  text: '#FF453A' },
};

const practiceAreas = [
  { id: 'arr', title: 'Arrays', icon: Brackets, solved: 42, total: 100, difficulty: 'Easy' as Difficulty },
  { id: 'tree', title: 'Trees', icon: TreePine, solved: 15, total: 60, difficulty: 'Medium' as Difficulty },
  { id: 'stack', title: 'Stacks', icon: Layers, solved: 8, total: 40, difficulty: 'Easy' as Difficulty },
  { id: 'hash', title: 'Hash Tables', icon: Hash, solved: 22, total: 50, difficulty: 'Medium' as Difficulty },
];

const recentProblems = [
  { id: 'p1', title: 'Valid Anagram', difficulty: 'Easy' as Difficulty, topic: 'Strings + Hash Table' },
  { id: 'p2', title: 'Group Anagram', difficulty: 'Medium' as Difficulty, topic: 'Array + Sorting' },
  { id: 'p3', title: 'Top K Frequent', difficulty: 'Medium' as Difficulty, topic: 'Heap + Bucket Sort' },
];

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const dc = difficultyColors[difficulty];
  return (
    <View style={[s.badge, { backgroundColor: dc.bg }]}>
      <AppText variant="caption2" color={dc.text} style={s.badgeText}>
        {difficulty}
      </AppText>
    </View>
  );
}

export default function PracticeScreen() {
  const { colors } = useTheme();

  return (
    <AppScreen scrollable>
      {/* Header */}
      <FadeIn delay={0} duration={420}>
        <View style={s.header}>
          <AppText variant="title" color={colors.primary} style={s.heading}>
            Practice
          </AppText>
          <AppText variant="subheadline" color={colors.secondary}>
            Sharpen your skills daily
          </AppText>
        </View>
      </FadeIn>

      {/* Daily Challenge */}
      <FadeIn delay={60} duration={420}>
        <AppCard padding={spacing.xl} variant="glow" style={s.card}>
          <View style={s.challengeHeader}>
            <View style={s.challengeLabel}>
              <Zap size={14} color={colors.accent.lime} strokeWidth={2} />
              <AppText variant="label" color={colors.accent.lime}>
                DAILY CHALLENGE
              </AppText>
            </View>
            <Trophy size={16} color={colors.accent.lime} strokeWidth={1.5} />
          </View>
          <AppText variant="title2" color={colors.primary} style={s.challengeTitle}>
            Two Sum
          </AppText>
          <View style={s.chipRow}>
            <DifficultyBadge difficulty="Easy" />
            <View style={[s.chip, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <AppText variant="caption2" color={colors.secondary}>Array</AppText>
            </View>
            <View style={[s.chip, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
              <AppText variant="caption2" color={colors.secondary}>Hash Table</AppText>
            </View>
          </View>
          <AppButton
            title="Solve"
            variant="sage"
            size="sm"
            icon={<ArrowRight size={14} color={colors.background} strokeWidth={2} />}
            style={s.solveBtn}
          />
        </AppCard>
      </FadeIn>

      {/* Practice Areas */}
      <FadeIn delay={120} duration={420}>
        <AppText variant="label" color={colors.secondary} style={s.sectionLabel}>
          PRACTICE AREAS
        </AppText>
        <View style={s.areasGrid}>
          {practiceAreas.map((area) => {
            const Icon = area.icon;
            return (
              <AppCard key={area.id} padding={spacing.lg} style={s.areaCard}>
                <View style={[s.areaIconWrap, { backgroundColor: 'rgba(255,255,255,0.04)' }]}>
                  <Icon size={18} color={colors.primary} strokeWidth={1.5} />
                </View>
                <AppText variant="subheadlineMedium" color={colors.primary} style={s.areaTitle}>
                  {area.title}
                </AppText>
                <DifficultyBadge difficulty={area.difficulty} />
                <View style={s.areaProgress}>
                  <ProgressBar
                    progress={area.solved / area.total}
                    height={4}
                    color={colors.accent.lime}
                  />
                  <AppText variant="caption2" color={colors.secondary} style={s.areaCount}>
                    {area.solved}/{area.total}
                  </AppText>
                </View>
              </AppCard>
            );
          })}
        </View>
      </FadeIn>

      {/* Recent Problems */}
      <FadeIn delay={180} duration={420}>
        <AppText variant="label" color={colors.secondary} style={s.sectionLabel}>
          RECENT PROBLEMS
        </AppText>
        <AppCard padding={0} style={s.card}>
          {recentProblems.map((problem, i) => (
            <AnimatedPressable key={problem.id} accessibilityLabel={`${problem.title}, ${problem.difficulty}`}>
              <View style={[
                s.problemRow,
                i < recentProblems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
              ]}>
                <View style={s.problemInfo}>
                  <AppText variant="subheadlineMedium" color={colors.primary}>
                    {problem.title}
                  </AppText>
                  <AppText variant="caption" color={colors.tertiary} style={s.subtextSpacing}>
                    {problem.topic}
                  </AppText>
                </View>
                <DifficultyBadge difficulty={problem.difficulty} />
              </View>
            </AnimatedPressable>
          ))}
        </AppCard>
      </FadeIn>
    </AppScreen>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
  },
  heading: {
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  card: {
    marginBottom: layout.cardGap,
  },

  // Section labels
  sectionLabel: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },

  // Daily Challenge
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  challengeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  challengeTitle: {
    letterSpacing: -0.3,
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  badgeText: {
    fontWeight: '600',
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  solveBtn: {
    alignSelf: 'flex-start',
  },

  // Practice Areas
  areasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.cardGap,
    marginBottom: layout.cardGap,
  },
  areaCard: {
    width: '47%',
    flexGrow: 1,
  },
  areaIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  areaTitle: {
    marginBottom: spacing.sm,
  },
  areaProgress: {
    marginTop: spacing.md,
  },
  areaCount: {
    marginTop: spacing.xs,
    textAlign: 'right',
  },

  // Recent Problems
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
  },
  problemInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  subtextSpacing: {
    marginTop: 2,
  },
});
