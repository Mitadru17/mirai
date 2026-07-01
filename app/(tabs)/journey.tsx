/**
 * Learning Path — Journey through DSA topics.
 * Audit fixes:
 *  1. Thicker, more visible timeline lines and nodes
 *  2. Completed card icon visible (not too faint)
 *  3. Reduced glow inconsistency — subtle, uniform accent border
 *  4. Improved progress bar (thicker, better track contrast)
 *  5. Better locked item appearance (clear but not obscured)
 *  6. Consistent card spacing between items
 *  7. Card padding and radius unified
 *  8. Overall visual hierarchy stronger
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Check, Terminal, Brackets, Link2, Layers } from 'lucide-react-native';
import { AppScreen }   from '../../src/components/ui/AppScreen';
import { AppCard }     from '../../src/components/ui/AppCard';
import { AppText }     from '../../src/components/ui/AppText';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { FadeIn }      from '../../src/components/ui/FadeIn';
import { useTheme }    from '../../src/theme/ThemeContext';
import { spacing, radius, layout } from '../../src/theme/spacing';

type Status = 'completed' | 'in_progress' | 'locked';

const pathData = [
  {
    id: 'fundamentals',
    status: 'completed' as Status,
    title: 'Fundamentals',
    desc: 'Big O notation, memory models, and basic language mechanics.',
    icon: Terminal,
    progress: { current: 15, total: 15, percent: 100 },
  },
  {
    id: 'arrays',
    status: 'in_progress' as Status,
    title: 'Arrays & Strings',
    desc: 'Two pointers, sliding window, and prefix sum techniques.',
    icon: Brackets,
    progress: { current: 13, total: 20, percent: 65 },
  },
  {
    id: 'linked',
    status: 'locked' as Status,
    title: 'Linked Lists',
    desc: 'Pointer manipulation, cycle detection, and reversal.',
    icon: Link2,
  },
  {
    id: 'stacks',
    status: 'locked' as Status,
    title: 'Stacks & Queues',
    desc: 'Monotonic stacks, BFS queues, and expression evaluation.',
    icon: Layers,
  },
];

function TimelineNode({ status, isFirst, isLast }: { status: Status; isFirst: boolean; isLast: boolean }) {
  const { colors } = useTheme();
  
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  const isLocked = status === 'locked';

  const topLineColor = isFirst ? 'transparent' : (isCompleted || isInProgress ? colors.accent.lime : colors.muted);
  const bottomLineColor = isLast ? 'transparent' : (isCompleted ? colors.accent.lime : colors.muted);

  return (
    <View style={s.nodeCol}>
      {/* Top line */}
      <View style={[s.line, { backgroundColor: topLineColor }]} />
      
      {/* Node */}
      <View style={s.nodeOuter}>
        {isCompleted && (
          <View style={[s.nodeCompleted, { backgroundColor: colors.accent.lime }]}>
            <Check size={12} color={colors.background} strokeWidth={3} />
          </View>
        )}
        {isInProgress && (
          <View style={[s.nodeActive, { borderColor: colors.accent.lime }]}>
            <View style={[s.nodeActiveDot, { backgroundColor: colors.accent.lime }]} />
          </View>
        )}
        {isLocked && (
          <View style={[s.nodeLocked, { borderColor: colors.muted }]}>
            <View style={[s.nodeLockedDot, { backgroundColor: colors.muted }]} />
          </View>
        )}
      </View>

      {/* Bottom line */}
      <View style={[s.line, s.lineBottom, { backgroundColor: bottomLineColor }]} />
    </View>
  );
}

function PathCard({ item, index, isFirst, isLast }: { 
  item: typeof pathData[0]; index: number; isFirst: boolean; isLast: boolean 
}) {
  const { colors } = useTheme();
  const Icon = item.icon;
  
  const isCompleted = item.status === 'completed';
  const isInProgress = item.status === 'in_progress';
  const isLocked = item.status === 'locked';

  return (
    <View style={s.row}>
      <TimelineNode status={item.status} isFirst={isFirst} isLast={isLast} />
      
      <View style={s.cardWrapper}>
        <FadeIn delay={index * 80}>
          <AppCard 
            variant={isInProgress ? 'glow' : 'default'}
            padding={spacing.xl}
            style={isLocked ? { opacity: 0.45 } : undefined}
          >
            <View style={s.cardHeader}>
              <View style={s.titleGroup}>
                <AppText 
                  variant="label" 
                  color={isLocked ? colors.tertiary : colors.accent.lime}
                >
                  {item.status.replace('_', ' ').toUpperCase()}
                </AppText>
                <AppText
                  variant="title2"
                  color={colors.primary}
                  style={s.cardTitle}
                >
                  {item.title}
                </AppText>
              </View>
              <View style={[s.iconBox, { 
                backgroundColor: isInProgress ? colors.accent.limeDim : 'rgba(255,255,255,0.04)',
                borderColor: isInProgress ? colors.accent.limeMuted : 'rgba(255,255,255,0.06)',
              }]}>
                <Icon 
                  size={20} 
                  color={isLocked ? colors.tertiary : (isInProgress ? colors.accent.lime : colors.primary)} 
                  strokeWidth={1.5} 
                />
              </View>
            </View>
            
            <AppText variant="subheadline" color={colors.secondary} style={s.desc}>
              {item.desc}
            </AppText>

            {item.progress && (
              <View style={s.progressSection}>
                <ProgressBar 
                  progress={item.progress.percent / 100} 
                  color={colors.accent.lime}
                  height={6}
                />
                <View style={s.progressStats}>
                  <AppText variant="caption" color={colors.secondary}>
                    {item.progress.current}/{item.progress.total} Problems
                  </AppText>
                  <AppText variant="caption" color={colors.accent.lime}>
                    {item.progress.percent}%
                  </AppText>
                </View>
              </View>
            )}
          </AppCard>
        </FadeIn>
      </View>
    </View>
  );
}

export default function JourneyScreen() {
  const { colors } = useTheme();

  return (
    <AppScreen scrollable>
      <FadeIn>
        <View style={s.header}>
          <AppText variant="title" color={colors.primary} style={s.heading}>
            Learning Path
          </AppText>
          <AppText variant="subheadline" color={colors.secondary}>
            Data Structures & Algorithms
          </AppText>
        </View>
      </FadeIn>

      <View style={s.pathContainer}>
        {pathData.map((item, i) => (
          <PathCard 
            key={item.id} 
            item={item} 
            index={i}
            isFirst={i === 0}
            isLast={i === pathData.length - 1} 
          />
        ))}
      </View>
    </AppScreen>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop: spacing.base,
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  heading: {
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  pathContainer: {
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },

  // Timeline
  nodeCol: {
    width: 40,
    alignItems: 'center',
  },
  line: {
    width: 2,
    height: 32,
  },
  lineBottom: {
    flex: 1,
  },
  nodeOuter: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodeCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  nodeActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  nodeLocked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  nodeLockedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Card
  cardWrapper: {
    flex: 1,
    paddingBottom: spacing.base,
    paddingLeft: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  cardTitle: {
    letterSpacing: -0.3,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  desc: {
    marginTop: spacing.xs,
  },
  progressSection: {
    marginTop: spacing.lg,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
});
