/**
 * LessonBlockView — Renders any single LessonBlock.
 *
 * The one switch that turns curriculum data into UI. Add a new block variant to
 * the union in curriculum/types.ts, then a matching case here. Layout spacing
 * between blocks is owned by the parent (lesson screen) via `gap`.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  Quote,
  Check,
  X,
  Gauge,
  type LucideIcon,
} from 'lucide-react-native';
import { AppText } from '../ui/AppText';
import { useColors } from '../../theme/ThemeContext';
import { spacing, radius } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { LessonBlock, CalloutTone } from '../../curriculum/types';
import { CodeText } from './CodeText';
import { VisualBlock } from './blocks/VisualBlock';
import { QuizBlock } from './blocks/QuizBlock';

interface LessonBlockViewProps {
  block: LessonBlock;
  onQuizAnswered?: (correct: boolean) => void;
}

function calloutStyle(tone: CalloutTone, colors: ThemeColors): { icon: LucideIcon; color: string; bg: string } {
  switch (tone) {
    case 'tip':     return { icon: Lightbulb,     color: colors.accent.lime,   bg: colors.accent.limeDim };
    case 'insight': return { icon: Sparkles,      color: colors.accent.lime,   bg: colors.accent.limeDim };
    case 'warning': return { icon: AlertTriangle, color: colors.status.warning, bg: 'rgba(255,214,10,0.07)' };
    case 'info':
    default:        return { icon: Info,          color: colors.secondary,     bg: colors.surface };
  }
}

export function LessonBlockView({ block, onQuizAnswered }: LessonBlockViewProps) {
  const colors = useColors();

  switch (block.type) {
    case 'concept':
      return (
        <View>
          {block.heading ? (
            <AppText variant="title3" color={colors.primary} style={styles.heading}>
              {block.heading}
            </AppText>
          ) : null}
          <AppText variant="body" color={colors.secondary} style={styles.bodyText}>
            {block.body}
          </AppText>
        </View>
      );

    case 'analogy':
      return (
        <View style={[styles.analogy, { borderColor: colors.borderAccent, backgroundColor: colors.accent.limeDim }]}>
          <View style={styles.analogyHeader}>
            <Quote size={14} color={colors.accent.lime} strokeWidth={2} />
            <AppText variant="label" color={colors.accent.lime}>
              {block.source ? `ANALOGY · ${block.source}` : 'ANALOGY'}
            </AppText>
          </View>
          <AppText variant="callout" color={colors.primary} style={styles.analogyBody}>
            {block.body}
          </AppText>
        </View>
      );

    case 'callout': {
      const { icon: Icon, color, bg } = calloutStyle(block.tone, colors);
      return (
        <View style={[styles.callout, { backgroundColor: bg, borderColor: colors.border }]}>
          <View style={[styles.calloutBar, { backgroundColor: color }]} />
          <View style={styles.calloutContent}>
            <View style={styles.calloutHeader}>
              <Icon size={15} color={color} strokeWidth={2} />
              {block.title ? (
                <AppText variant="subheadlineMedium" color={color}>
                  {block.title}
                </AppText>
              ) : null}
            </View>
            <AppText variant="footnote" color={colors.secondary} style={styles.calloutBody}>
              {block.body}
            </AppText>
          </View>
        </View>
      );
    }

    case 'list':
      return (
        <View>
          {block.heading ? (
            <AppText variant="subheadlineMedium" color={colors.primary} style={styles.listHeading}>
              {block.heading}
            </AppText>
          ) : null}
          <View style={styles.listItems}>
            {block.items.map((item, i) => (
              <View key={i} style={styles.listRow}>
                <AppText variant="callout" color={colors.accent.lime} style={styles.bullet}>
                  {block.ordered ? `${i + 1}.` : '•'}
                </AppText>
                <AppText variant="callout" color={colors.secondary} style={styles.listText}>
                  {item}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      );

    case 'code':
      return <CodeText code={block.code} caption={block.caption} />;

    case 'walkthrough':
      return (
        <View>
          {block.heading ? (
            <AppText variant="subheadlineMedium" color={colors.primary} style={styles.listHeading}>
              {block.heading}
            </AppText>
          ) : null}
          <View style={styles.steps}>
            {block.steps.map((step, i) => (
              <View key={i} style={styles.step}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepNum, { backgroundColor: colors.accent.limeMuted }]}>
                    <AppText variant="caption" color={colors.accent.lime}>
                      {i + 1}
                    </AppText>
                  </View>
                  <View style={styles.stepCode}>
                    <CodeText code={step.code} inset />
                  </View>
                </View>
                <AppText variant="footnote" color={colors.secondary} style={styles.stepExplanation}>
                  {step.explanation}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      );

    case 'complexity':
      return (
        <View style={[styles.table, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={styles.tableHeader}>
            <Gauge size={15} color={colors.accent.lime} strokeWidth={2} />
            <AppText variant="label" color={colors.accent.lime}>
              {block.heading ?? 'COMPLEXITY'}
            </AppText>
          </View>
          {block.rows.map((row, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                i > 0 && { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
              ]}
            >
              <View style={styles.tableRowTop}>
                <AppText variant="subheadlineMedium" color={colors.primary} style={styles.tableOp}>
                  {row.operation}
                </AppText>
                <View style={styles.badges}>
                  <View style={[styles.badge, { backgroundColor: colors.accent.limeMuted }]}>
                    <AppText variant="caption" color={colors.accent.lime}>
                      {row.time}
                    </AppText>
                  </View>
                  {row.space ? (
                    <View style={[styles.badge, { backgroundColor: colors.cardElevated }]}>
                      <AppText variant="caption" color={colors.secondary}>
                        {row.space}
                      </AppText>
                    </View>
                  ) : null}
                </View>
              </View>
              {row.note ? (
                <AppText variant="caption" color={colors.tertiary} style={styles.tableNote}>
                  {row.note}
                </AppText>
              ) : null}
            </View>
          ))}
        </View>
      );

    case 'visual':
      return <VisualBlock visual={block.visual} />;

    case 'mistakes':
      return (
        <View>
          <AppText variant="subheadlineMedium" color={colors.primary} style={styles.listHeading}>
            {block.heading ?? 'Common Mistakes'}
          </AppText>
          <View style={styles.mistakes}>
            {block.items.map((item, i) => (
              <View key={i} style={[styles.mistakeCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <View style={styles.mistakeRow}>
                  <X size={15} color={colors.status.error} strokeWidth={2.5} style={styles.mistakeIcon} />
                  <AppText variant="footnote" color={colors.secondary} style={styles.mistakeText}>
                    {item.mistake}
                  </AppText>
                </View>
                <View style={styles.mistakeRow}>
                  <Check size={15} color={colors.accent.lime} strokeWidth={2.5} style={styles.mistakeIcon} />
                  <AppText variant="footnote" color={colors.primary} style={styles.mistakeText}>
                    {item.fix}
                  </AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      );

    case 'quiz':
      return (
        <QuizBlock
          question={block.question}
          options={block.options}
          answerIndex={block.answerIndex}
          explanation={block.explanation}
          onAnswered={onQuizAnswered}
        />
      );

    case 'summary':
      return (
        <View style={[styles.summary, { borderColor: colors.borderAccent, backgroundColor: colors.accent.limeDim }]}>
          <AppText variant="label" color={colors.accent.lime} style={styles.summaryLabel}>
            KEY TAKEAWAYS
          </AppText>
          <View style={styles.summaryPoints}>
            {block.points.map((point, i) => (
              <View key={i} style={styles.summaryRow}>
                <Check size={16} color={colors.accent.lime} strokeWidth={2.5} style={styles.summaryIcon} />
                <AppText variant="subheadline" color={colors.primary} style={styles.summaryText}>
                  {point}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  heading: {
    marginBottom: spacing.sm,
  },
  bodyText: {
    lineHeight: 25,
  },
  // Analogy
  analogy: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  analogyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  analogyBody: {
    lineHeight: 23,
  },
  // Callout
  callout: {
    flexDirection: 'row',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  calloutBar: {
    width: 3,
  },
  calloutContent: {
    flex: 1,
    padding: spacing.base,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  calloutBody: {
    lineHeight: 20,
  },
  // List
  listHeading: {
    marginBottom: spacing.md,
  },
  listItems: {
    gap: spacing.sm,
  },
  listRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  bullet: {
    minWidth: 18,
  },
  listText: {
    flex: 1,
    lineHeight: 23,
  },
  // Walkthrough
  steps: {
    gap: spacing.base,
  },
  step: {
    gap: spacing.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  stepCode: {
    flex: 1,
  },
  stepExplanation: {
    marginLeft: 32,
    lineHeight: 20,
  },
  // Complexity table
  table: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tableRow: {
    paddingVertical: spacing.md,
  },
  tableRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tableOp: {
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  tableNote: {
    marginTop: spacing.xs,
    lineHeight: 17,
  },
  // Mistakes
  mistakes: {
    gap: spacing.md,
  },
  mistakeCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  mistakeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  mistakeIcon: {
    marginTop: 2,
  },
  mistakeText: {
    flex: 1,
    lineHeight: 20,
  },
  // Summary
  summary: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.xl,
  },
  summaryLabel: {
    marginBottom: spacing.md,
  },
  summaryPoints: {
    gap: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  summaryIcon: {
    marginTop: 2,
  },
  summaryText: {
    flex: 1,
    lineHeight: 21,
  },
});
