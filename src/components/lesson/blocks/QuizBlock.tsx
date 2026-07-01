/**
 * QuizBlock — Interactive single-answer mini quiz.
 *
 * Reveals correctness + explanation on selection, then locks. Reports the
 * result upward exactly once so the lesson can score completion.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Check, X, HelpCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { AppText } from '../../ui/AppText';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useColors } from '../../../theme/ThemeContext';
import { spacing, radius } from '../../../theme/spacing';

interface QuizBlockProps {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  onAnswered?: (correct: boolean) => void;
}

export function QuizBlock({ question, options, answerIndex, explanation, onAnswered }: QuizBlockProps) {
  const colors = useColors();
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return;
      const correct = index === answerIndex;
      setSelected(index);
      Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
      );
      onAnswered?.(correct);
    },
    [answered, answerIndex, onAnswered]
  );

  const isCorrect = selected === answerIndex;

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <HelpCircle size={16} color={colors.accent.lime} strokeWidth={2} />
        <AppText variant="label" color={colors.accent.lime}>
          QUICK CHECK
        </AppText>
      </View>

      <AppText variant="title3" color={colors.primary} style={styles.question}>
        {question}
      </AppText>

      <View style={styles.options}>
        {options.map((option, i) => {
          const isAnswer = i === answerIndex;
          const isPicked = i === selected;

          // Colour logic after answering.
          let borderColor: string = colors.border;
          let bg: string = colors.cardElevated;
          let tint: string = colors.primary;
          if (answered) {
            if (isAnswer) {
              borderColor = colors.accent.lime;
              bg = colors.accent.limeMuted;
              tint = colors.accent.lime;
            } else if (isPicked) {
              borderColor = colors.status.error;
              bg = 'rgba(255,69,58,0.08)';
              tint = colors.status.error;
            } else {
              tint = colors.tertiary;
            }
          }

          return (
            <AnimatedPressable
              key={i}
              onPress={() => handleSelect(i)}
              disabled={answered}
              haptic={false}
              accessibilityLabel={option}
              accessibilityRole="button"
              style={[styles.option, { borderColor, backgroundColor: bg }]}
            >
              <AppText variant="callout" color={tint} style={styles.optionText}>
                {option}
              </AppText>
              {answered && isAnswer ? (
                <Check size={18} color={colors.accent.lime} strokeWidth={2.5} />
              ) : answered && isPicked ? (
                <X size={18} color={colors.status.error} strokeWidth={2.5} />
              ) : null}
            </AnimatedPressable>
          );
        })}
      </View>

      {answered ? (
        <View
          style={[
            styles.explanation,
            {
              backgroundColor: isCorrect ? colors.accent.limeDim : colors.surface,
              borderColor: isCorrect ? colors.borderAccent : colors.border,
            },
          ]}
        >
          <AppText variant="subheadlineMedium" color={isCorrect ? colors.accent.lime : colors.primary} style={styles.verdict}>
            {isCorrect ? 'Correct' : 'Not quite'}
          </AppText>
          <AppText variant="footnote" color={colors.secondary}>
            {explanation}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  question: {
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  optionText: {
    flex: 1,
  },
  explanation: {
    marginTop: spacing.lg,
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  verdict: {
    marginBottom: spacing.xs,
  },
});
