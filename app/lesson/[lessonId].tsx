/**
 * Lesson Screen — the core learning experience.
 *
 * Renders a structured lesson (curriculum data → interactive blocks), tracks
 * quiz performance and time on task, and persists completion through the
 * progress store. This is what "Continue Learning" and Journey cards open.
 */

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Clock, ArrowRight, Check, BookMarked } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { AppText } from '../../src/components/ui/AppText';
import { AppButton } from '../../src/components/ui/AppButton';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { AnimatedPressable } from '../../src/components/ui/AnimatedPressable';
import { FadeIn } from '../../src/components/ui/FadeIn';
import { LessonBlockView } from '../../src/components/lesson';
import { useColors } from '../../src/theme/ThemeContext';
import { spacing, radius, layout } from '../../src/theme/spacing';
import {
  getLessonRef,
  getNextLesson,
  getRelatedLessons,
  countQuizzes,
} from '../../src/curriculum';
import { useProgressStore, useLearning } from '../../src/stores/progressStore';
import { formatDuration } from '../../src/utils/helpers';

export default function LessonScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const ref = lessonId ? getLessonRef(lessonId) : undefined;

  const startLesson = useProgressStore((s) => s.startLesson);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const learning = useLearning();

  const startTime = useRef<number>(Date.now());
  const answeredRef = useRef<Set<number>>(new Set());
  const [quizState, setQuizState] = useState({ answered: 0, correct: 0 });
  const [justCompleted, setJustCompleted] = useState(false);

  const totalQuizzes = ref ? countQuizzes(ref.lesson) : 0;
  const alreadyDone = lessonId ? learning.lessonFraction(lessonId) === 1 : false;
  const isComplete = alreadyDone || justCompleted;

  // Mark the lesson as started (in-progress) on entry.
  useEffect(() => {
    if (ref) {
      startTime.current = Date.now();
      startLesson(ref.lesson.id, ref.module.id);
    }
    // Only re-run when the lesson identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const handleQuizAnswered = useCallback((index: number, correct: boolean) => {
    if (answeredRef.current.has(index)) return;
    answeredRef.current.add(index);
    setQuizState((prev) => ({
      answered: prev.answered + 1,
      correct: prev.correct + (correct ? 1 : 0),
    }));
  }, []);

  const handleComplete = useCallback(async () => {
    if (!ref) return;
    const elapsedMin = Math.round((Date.now() - startTime.current) / 60000);
    const minutes = Math.max(1, Math.min(ref.lesson.estimatedMinutes + 15, elapsedMin || ref.lesson.estimatedMinutes));
    await completeLesson(ref.lesson.id, ref.module.id, {
      quizCorrect: quizState.correct,
      quizTotal: totalQuizzes,
      minutes,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setJustCompleted(true);
  }, [ref, completeLesson, quizState.correct, totalQuizzes]);

  const nextRef = useMemo(() => (lessonId ? getNextLesson(lessonId) : null), [lessonId]);
  const related = useMemo(() => (ref ? getRelatedLessons(ref.lesson) : []), [ref]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  }, [router]);

  // Android hardware back → same as header back.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  // ── Not found ──────────────────────────────────────────────────────────
  if (!ref) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <AppText variant="title2" color={colors.primary}>Lesson not found</AppText>
        <AppText variant="subheadline" color={colors.secondary} style={styles.notFoundSub}>
          This lesson may have moved.
        </AppText>
        <AppButton title="Go back" variant="secondary" onPress={goBack} style={styles.notFoundBtn} />
      </View>
    );
  }

  const { lesson, module, indexInModule } = ref;
  const goToLesson = (id: string) => router.push(`/lesson/${id}`);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm, borderBottomColor: colors.borderSubtle }]}>
        <AnimatedPressable onPress={goBack} accessibilityLabel="Go back" style={styles.backBtn} scaleValue={0.9}>
          <ChevronLeft size={24} color={colors.primary} strokeWidth={2} />
        </AnimatedPressable>
        <View style={styles.headerCenter}>
          <AppText variant="caption" color={colors.accent.lime} numberOfLines={1}>
            {module.title.toUpperCase()} · {indexInModule + 1}/{module.lessons.length}
          </AppText>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        {/* Title block */}
        <FadeIn delay={0} duration={380}>
          <AppText variant="heading" color={colors.primary} style={styles.title}>
            {lesson.title}
          </AppText>
          <AppText variant="subheadline" color={colors.secondary} style={styles.subtitle}>
            {lesson.subtitle}
          </AppText>
          <View style={styles.metaRow}>
            <Clock size={13} color={colors.tertiary} strokeWidth={1.5} />
            <AppText variant="caption" color={colors.tertiary}>
              {formatDuration(lesson.estimatedMinutes)}
            </AppText>
            {totalQuizzes > 0 ? (
              <AppText variant="caption" color={colors.tertiary}>
                · {quizState.answered}/{totalQuizzes} checks
              </AppText>
            ) : null}
            {isComplete ? (
              <View style={[styles.doneChip, { backgroundColor: colors.accent.limeMuted }]}>
                <Check size={11} color={colors.accent.lime} strokeWidth={3} />
                <AppText variant="caption2" color={colors.accent.lime}>Completed</AppText>
              </View>
            ) : null}
          </View>
        </FadeIn>

        {/* Objectives */}
        {lesson.objectives.length > 0 ? (
          <FadeIn delay={60} duration={380}>
            <View style={[styles.objectives, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <AppText variant="label" color={colors.secondary} style={styles.objLabel}>
                IN THIS LESSON
              </AppText>
              {lesson.objectives.map((obj, i) => (
                <View key={i} style={styles.objRow}>
                  <View style={[styles.objDot, { backgroundColor: colors.accent.lime }]} />
                  <AppText variant="subheadline" color={colors.primary} style={styles.objText}>
                    {obj}
                  </AppText>
                </View>
              ))}
            </View>
          </FadeIn>
        ) : null}

        {/* Blocks */}
        <View style={styles.blocks}>
          {lesson.blocks.map((block, i) => (
            <FadeIn key={i} delay={Math.min(90 + i * 20, 240)} duration={360} translateY={8}>
              <LessonBlockView
                block={block}
                onQuizAnswered={(correct) => handleQuizAnswered(i, correct)}
              />
            </FadeIn>
          ))}
        </View>

        {/* Revision cards */}
        {lesson.revisionCards.length > 0 ? (
          <View style={styles.revision}>
            <View style={styles.revisionHeader}>
              <BookMarked size={15} color={colors.accent.lime} strokeWidth={2} />
              <AppText variant="label" color={colors.secondary}>REVISION CARDS</AppText>
            </View>
            {lesson.revisionCards.map((card, i) => (
              <View key={i} style={[styles.revisionCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <AppText variant="subheadlineMedium" color={colors.primary} style={styles.revisionFront}>
                  {card.front}
                </AppText>
                <AppText variant="footnote" color={colors.secondary}>
                  {card.back}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        {/* Related lessons */}
        {related.length > 0 ? (
          <View style={styles.related}>
            <AppText variant="label" color={colors.secondary} style={styles.relatedLabel}>
              CONTINUE WITH
            </AppText>
            {related.map((rel) => (
              <AnimatedPressable
                key={rel.id}
                onPress={() => goToLesson(rel.id)}
                accessibilityLabel={`Open lesson ${rel.title}`}
                style={[styles.relatedRow, { borderColor: colors.border, backgroundColor: colors.card }]}
              >
                <View style={styles.relatedInfo}>
                  <AppText variant="subheadlineMedium" color={colors.primary}>{rel.title}</AppText>
                  <AppText variant="caption" color={colors.tertiary} style={styles.relatedSub}>
                    {rel.subtitle}
                  </AppText>
                </View>
                <ArrowRight size={18} color={colors.tertiary} strokeWidth={1.5} />
              </AnimatedPressable>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + spacing.base,
            backgroundColor: colors.background,
            borderTopColor: colors.borderSubtle,
          },
        ]}
      >
        {!isComplete ? (
          <AppButton
            title="Complete Lesson"
            variant="sage"
            size="lg"
            fullWidth
            onPress={handleComplete}
            icon={<Check size={18} color={colors.background} strokeWidth={2.5} />}
            accessibilityLabel="Mark lesson complete"
          />
        ) : nextRef ? (
          <AppButton
            title="Next Lesson"
            variant="sage"
            size="lg"
            fullWidth
            onPress={() => router.replace(`/lesson/${nextRef.lesson.id}`)}
            icon={<ArrowRight size={18} color={colors.background} strokeWidth={2.5} />}
            accessibilityLabel="Go to next lesson"
          />
        ) : (
          <AppButton
            title="Back to Home"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.replace('/(tabs)')}
            accessibilityLabel="Return home"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: layout.screenPaddingH },
  notFoundSub: { marginTop: spacing.sm, marginBottom: spacing.xl },
  notFoundBtn: { minWidth: 160 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  scroll: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing.xl,
  },
  title: {
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing['2xl'],
  },
  doneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginLeft: spacing.xs,
  },

  objectives: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
  },
  objLabel: {
    marginBottom: spacing.md,
  },
  objRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  objDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  objText: {
    flex: 1,
  },

  blocks: {
    gap: spacing['2xl'],
  },

  revision: {
    marginTop: spacing['3xl'],
    gap: spacing.md,
  },
  revisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  revisionCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.xs,
  },
  revisionFront: {},

  related: {
    marginTop: spacing['3xl'],
  },
  relatedLabel: {
    marginBottom: spacing.md,
  },
  relatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  relatedInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  relatedSub: {
    marginTop: 2,
  },

  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing.base,
    borderTopWidth: 1,
  },
});
