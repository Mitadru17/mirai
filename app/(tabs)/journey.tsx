/**
 * Journey — the learning roadmap.
 *
 * A living timeline of the curriculum, driven entirely by real module progress.
 * Modules unlock as their prerequisites complete; each card jumps to the next
 * unfinished lesson. Nothing here is hardcoded — add a module to the curriculum
 * and it appears automatically.
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Check, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppScreen }   from '../../src/components/ui/AppScreen';
import { AppCard }     from '../../src/components/ui/AppCard';
import { AppText }     from '../../src/components/ui/AppText';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { FadeIn }      from '../../src/components/ui/FadeIn';
import { useTheme }    from '../../src/theme/ThemeContext';
import { spacing, radius } from '../../src/theme/spacing';
import { getCurriculumIcon } from '../../src/curriculum';
import type { Lesson } from '../../src/curriculum';
import { useLearning } from '../../src/stores/progressStore';
import type { ModuleProgress } from '../../src/stores/learningSelectors';
import { formatDuration } from '../../src/utils/helpers';

type NodeStatus = 'completed' | 'in_progress' | 'available' | 'locked';

function nodeStatus(mp: ModuleProgress): NodeStatus {
  if (mp.status === 'completed') return 'completed';
  if (mp.status === 'locked') return 'locked';
  if (mp.status === 'in_progress') return 'in_progress';
  return 'available';
}

function statusLabel(status: NodeStatus): string {
  switch (status) {
    case 'completed':   return 'COMPLETED';
    case 'in_progress': return 'IN PROGRESS';
    case 'available':   return 'READY';
    case 'locked':      return 'LOCKED';
  }
}

function TimelineNode({ status, isFirst, isLast }: { status: NodeStatus; isFirst: boolean; isLast: boolean }) {
  const { colors } = useTheme();
  const active = status === 'completed' || status === 'in_progress';

  const topLineColor = isFirst ? 'transparent' : active ? colors.accent.lime : colors.muted;
  const bottomLineColor = isLast ? 'transparent' : status === 'completed' ? colors.accent.lime : colors.muted;

  return (
    <View style={s.nodeCol}>
      <View style={[s.line, { backgroundColor: topLineColor }]} />
      <View style={s.nodeOuter}>
        {status === 'completed' && (
          <View style={[s.nodeCompleted, { backgroundColor: colors.accent.lime }]}>
            <Check size={12} color={colors.background} strokeWidth={3} />
          </View>
        )}
        {status === 'in_progress' && (
          <View style={[s.nodeActive, { borderColor: colors.accent.lime }]}>
            <View style={[s.nodeActiveDot, { backgroundColor: colors.accent.lime }]} />
          </View>
        )}
        {status === 'available' && (
          <View style={[s.nodeActive, { borderColor: colors.tertiary }]}>
            <View style={[s.nodeActiveDot, { backgroundColor: colors.tertiary }]} />
          </View>
        )}
        {status === 'locked' && (
          <View style={[s.nodeLocked, { borderColor: colors.muted }]}>
            <View style={[s.nodeLockedDot, { backgroundColor: colors.muted }]} />
          </View>
        )}
      </View>
      <View style={[s.line, s.lineBottom, { backgroundColor: bottomLineColor }]} />
    </View>
  );
}

function PathCard({
  mp,
  index,
  isFirst,
  isLast,
  onPress,
}: {
  mp: ModuleProgress;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const status = nodeStatus(mp);
  const Icon = getCurriculumIcon(mp.module.icon);
  const isLocked = status === 'locked';
  const isInProgress = status === 'in_progress';

  return (
    <View style={s.row}>
      <TimelineNode status={status} isFirst={isFirst} isLast={isLast} />

      <View style={s.cardWrapper}>
        <FadeIn delay={index * 70}>
          <AppCard
            variant={isInProgress ? 'glow' : 'default'}
            padding={spacing.xl}
            onPress={isLocked ? undefined : onPress}
            style={isLocked ? s.locked : undefined}
            accessibilityLabel={`${mp.module.title}, ${statusLabel(status).toLowerCase()}`}
          >
            <View style={s.cardHeader}>
              <View style={s.titleGroup}>
                <AppText variant="label" color={isLocked ? colors.tertiary : colors.accent.lime}>
                  {statusLabel(status)}
                </AppText>
                <AppText variant="title2" color={colors.primary} style={s.cardTitle}>
                  {mp.module.title}
                </AppText>
              </View>
              <View
                style={[
                  s.iconBox,
                  {
                    backgroundColor: isInProgress ? colors.accent.limeDim : 'rgba(255,255,255,0.04)',
                    borderColor: isInProgress ? colors.accent.limeMuted : 'rgba(255,255,255,0.06)',
                  },
                ]}
              >
                {isLocked ? (
                  <Lock size={18} color={colors.tertiary} strokeWidth={1.5} />
                ) : (
                  <Icon
                    size={20}
                    color={isInProgress ? colors.accent.lime : colors.primary}
                    strokeWidth={1.5}
                  />
                )}
              </View>
            </View>

            <AppText variant="subheadline" color={colors.secondary} style={s.desc}>
              {mp.module.tagline}
            </AppText>

            <View style={s.metaRow}>
              <AppText variant="caption2" color={colors.tertiary}>
                {mp.module.difficulty.toUpperCase()} · {formatDuration(mp.durationMinutes)}
              </AppText>
            </View>

            {!isLocked && (
              <View style={s.progressSection}>
                <ProgressBar progress={mp.percent / 100} color={colors.accent.lime} height={6} />
                <View style={s.progressStats}>
                  <AppText variant="caption" color={colors.secondary}>
                    {mp.completedLessons}/{mp.totalLessons} Lessons
                  </AppText>
                  <AppText variant="caption" color={colors.accent.lime}>
                    {mp.percent}%
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
  const router = useRouter();
  const { modules, overallPercent, completedLessons, totalLessons, lessonFraction } = useLearning();

  const openModule = useCallback(
    (mp: ModuleProgress) => {
      // Jump to the first lesson not yet completed, else the module's first lesson.
      const target: Lesson =
        mp.module.lessons.find((l) => lessonFraction(l.id) < 1) ?? mp.module.lessons[0];
      router.push(`/lesson/${target.id}`);
    },
    [router, lessonFraction]
  );

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
          <View style={s.overall}>
            <ProgressBar progress={overallPercent / 100} color={colors.accent.lime} height={6} />
            <AppText variant="caption" color={colors.tertiary} style={s.overallText}>
              {completedLessons} of {totalLessons} lessons · {overallPercent}% complete
            </AppText>
          </View>
        </View>
      </FadeIn>

      <View style={s.pathContainer}>
        {modules.map((mp, i) => (
          <PathCard
            key={mp.module.id}
            mp={mp}
            index={i}
            isFirst={i === 0}
            isLast={i === modules.length - 1}
            onPress={() => openModule(mp)}
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
  },
  heading: {
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  overall: {
    marginTop: spacing.lg,
  },
  overallText: {
    marginTop: spacing.sm,
  },
  pathContainer: {
    paddingBottom: spacing.xl,
  },
  row: {
    flexDirection: 'row',
  },
  locked: {
    opacity: 0.5,
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
  metaRow: {
    marginTop: spacing.sm,
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
