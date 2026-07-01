/**
 * Profile / Analytics — Personal learning dashboard.
 * Audit fixes:
 *  1. Profile header spacing consistent
 *  2. Discipline score card — proper padding, aligned badge
 *  3. Stats cards — consistent icon sizes
 *  4. Mastered topics card unified with other cards
 *  5. Learning activity graph improved (better bar widths)
 *  6. Achievements section not empty
 *  7. Bottom nav icon alignment
 *  8. Overall card radius consistency
 *  9. More hierarchy/interactivity
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Award, Flame, Target, BookOpen } from 'lucide-react-native';
import { AppScreen }        from '../../src/components/ui/AppScreen';
import { AppCard }          from '../../src/components/ui/AppCard';
import { AppText }          from '../../src/components/ui/AppText';
import { ProgressBar }      from '../../src/components/ui/ProgressBar';
import { FadeIn }           from '../../src/components/ui/FadeIn';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { useTheme }         from '../../src/theme/ThemeContext';
import { useAppStore }      from '../../src/stores/appStore';
import { spacing, radius, layout } from '../../src/theme/spacing';

const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const weekActivity = [0.2, 0.5, 0.8, 0.4, 0.9, 0.3, 0.7];

const achievements = [
  { id: 'first', title: 'First Steps', desc: 'Complete your first lesson', earned: true },
  { id: 'streak7', title: 'Week Warrior', desc: '7-day learning streak', earned: true },
  { id: 'problems10', title: 'Problem Solver', desc: 'Solve 10 problems', earned: false },
];

export default function ProfileScreen() {
  const { colors } = useTheme();
  const userName   = useAppStore((s) => s.userName);

  return (
    <AppScreen scrollable>
      {/* Header */}
      <FadeIn delay={0} duration={420}>
        <View style={s.header}>
          <View style={s.headerRow}>
            <View style={s.titleGroup}>
              <AppText variant="title" color={colors.primary} style={s.nameText}>
                {userName}
              </AppText>
              <AppText variant="subheadline" color={colors.secondary}>
                Beginner · 14 problems solved
              </AppText>
            </View>
            <View style={[s.avatar, { 
              backgroundColor: colors.accent.limeDim, 
              borderColor: colors.accent.limeMuted 
            }]}>
              <AppText variant="title3" color={colors.accent.lime}>
                {userName.charAt(0).toUpperCase()}
              </AppText>
            </View>
          </View>
        </View>
      </FadeIn>

      {/* Discipline Score */}
      <FadeIn delay={60} duration={420}>
        <AppCard padding={spacing.xl} style={s.card} variant="glow">
          <View style={s.scoreHeader}>
            <AppText variant="label" color={colors.accent.lime}>
              DISCIPLINE SCORE
            </AppText>
            <Flame size={16} color={colors.accent.lime} strokeWidth={2} />
          </View>
          <View style={s.scoreRow}>
            <AppText variant="display" color={colors.accent.lime} style={s.scoreValue}>
              84
            </AppText>
            <View style={s.scoreInfo}>
              <View style={[s.rankBadge, { backgroundColor: colors.accent.limeDim }]}>
                <AppText variant="caption" color={colors.accent.lime} style={s.rankText}>
                  Top 15%
                </AppText>
              </View>
              <AppText variant="caption" color={colors.secondary} style={s.rankSubtext}>
                of all learners
              </AppText>
            </View>
          </View>
        </AppCard>
      </FadeIn>

      {/* Statistics Grid */}
      <FadeIn delay={120} duration={420}>
        <View style={s.statsGrid}>
          <AppCard padding={spacing.lg} style={s.statCard}>
            <Target size={18} color={colors.primary} strokeWidth={1.5} />
            <AppText variant="title2" color={colors.primary} style={s.statValue}>
              14
            </AppText>
            <AppText variant="caption" color={colors.secondary}>
              Problems Solved
            </AppText>
          </AppCard>
          <AppCard padding={spacing.lg} style={s.statCard}>
            <Flame size={18} color={colors.primary} strokeWidth={1.5} />
            <AppText variant="title2" color={colors.primary} style={s.statValue}>
              12
            </AppText>
            <AppText variant="caption" color={colors.secondary}>
              Day Streak
            </AppText>
          </AppCard>
        </View>
      </FadeIn>

      {/* Weekly Activity */}
      <FadeIn delay={180} duration={420}>
        <AppCard padding={spacing.xl} style={s.card}>
          <View style={s.sectionHeader}>
            <AppText variant="label" color={colors.secondary}>
              LEARNING ACTIVITY
            </AppText>
            <AppText variant="caption" color={colors.tertiary}>
              Last 7 days
            </AppText>
          </View>
          <View style={s.activityContainer}>
            {weekActivity.map((val, i) => (
              <View key={i} style={s.activityCol}>
                <View style={s.barContainer}>
                  <View style={[
                    s.activityBar, 
                    { 
                      height: Math.max(6, val * 56), 
                      backgroundColor: val > 0.6 ? colors.accent.lime : colors.cardElevated,
                    },
                  ]} />
                </View>
                <AppText variant="caption2" color={colors.tertiary} style={s.dayLabel}>
                  {weekDays[i]}
                </AppText>
              </View>
            ))}
          </View>
        </AppCard>
      </FadeIn>

      {/* Mastered Topics */}
      <FadeIn delay={240} duration={420}>
        <AppCard padding={spacing.xl} style={s.card}>
          <AppText variant="label" color={colors.secondary} style={s.sectionLabel}>
            MASTERED TOPICS
          </AppText>
          {['Binary Search', 'Two Pointers', 'Sliding Window'].map((topic, i) => (
            <View key={topic} style={[
              s.topicRow,
              i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
            ]}>
              <View style={[s.topicIcon, { backgroundColor: colors.accent.limeDim }]}>
                <BookOpen size={14} color={colors.accent.lime} strokeWidth={1.5} />
              </View>
              <AppText variant="subheadlineMedium" color={colors.primary} style={s.topicName}>
                {topic}
              </AppText>
              <AppText variant="caption" color={colors.accent.lime}>✓</AppText>
            </View>
          ))}
        </AppCard>
      </FadeIn>

      {/* Achievements */}
      <FadeIn delay={300} duration={420}>
        <AppCard padding={spacing.xl} style={s.card}>
          <View style={s.sectionHeader}>
            <AppText variant="label" color={colors.secondary}>
              ACHIEVEMENTS
            </AppText>
            <AnimatedPressable>
              <AppText variant="caption" color={colors.accent.lime} style={s.viewAllText}>
                View All
              </AppText>
            </AnimatedPressable>
          </View>
          {achievements.map((ach, i) => (
            <View key={ach.id} style={[
              s.achieveItem,
              i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
            ]}>
              <View style={[
                s.achieveIcon,
                { 
                  backgroundColor: ach.earned ? colors.accent.limeDim : 'rgba(255,255,255,0.03)',
                  borderColor: ach.earned ? colors.accent.limeMuted : colors.borderSubtle,
                },
              ]}>
                <Award 
                  size={18} 
                  color={ach.earned ? colors.accent.lime : colors.tertiary} 
                  strokeWidth={1.5} 
                />
              </View>
              <View style={s.achieveInfo}>
                <AppText 
                  variant="subheadlineMedium" 
                  color={ach.earned ? colors.primary : colors.tertiary}
                >
                  {ach.title}
                </AppText>
                <AppText variant="caption" color={colors.secondary} style={s.achieveDesc}>
                  {ach.desc}
                </AppText>
              </View>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flex: 1,
  },
  nameText: {
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cards
  card: {
    marginBottom: layout.cardGap,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  sectionLabel: {
    marginBottom: spacing.base,
  },

  // Discipline Score
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  scoreValue: {
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -2,
    fontWeight: '300',
  },
  scoreInfo: {
    justifyContent: 'center',
  },
  rankBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    gap: layout.cardGap,
    marginBottom: layout.cardGap,
  },
  statCard: {
    flex: 1,
    gap: spacing.sm,
  },
  statValue: {
    letterSpacing: -0.3,
  },

  // Activity Graph
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  activityCol: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 56,
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  activityBar: {
    width: 12,
    borderRadius: 6,
  },
  dayLabel: {},

  // Mastered Topics
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicName: {
    flex: 1,
  },

  // Achievements
  achieveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  achieveIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achieveInfo: {
    flex: 1,
  },
  achieveDesc: {
    marginTop: 2,
  },
  rankText: {
    fontWeight: '600',
  },
  rankSubtext: {
    marginTop: 4,
  },
  viewAllText: {
    fontWeight: '500',
  },
});
