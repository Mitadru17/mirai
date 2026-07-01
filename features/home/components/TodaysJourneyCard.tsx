/**
 * Today's Journey Card
 * Shows three daily tasks with completion status.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react-native';
import { AppCard, AppText, AnimatedPressable } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout } from '../../../src/theme/spacing';
import type { DailyTask } from '../types';

interface TodaysJourneyCardProps {
  tasks: DailyTask[];
  onTaskPress: (task: DailyTask) => void;
}

interface TaskItemProps {
  task: DailyTask;
  onPress: () => void;
}

function TaskItem({ task, onPress }: TaskItemProps) {
  const colors = useColors();
  const Icon = task.completed ? CheckCircle2 : Circle;
  const iconColor = task.completed ? colors.accent.lime : colors.tertiary;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={!task.href}
      style={styles.taskItem}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, ${task.completed ? 'completed' : 'not completed'}`}
    >
      <View style={styles.taskContent}>
        <Icon size={20} color={iconColor} strokeWidth={1.5} />
        <AppText
          variant="subheadline"
          color={task.completed ? colors.secondary : colors.primary}
          style={styles.taskText}
        >
          {task.title}
        </AppText>
        {!task.completed && task.href ? (
          <ChevronRight size={16} color={colors.tertiary} strokeWidth={1.5} />
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

export function TodaysJourneyCard({ tasks, onTaskPress }: TodaysJourneyCardProps) {
  const colors = useColors();
  const done = tasks.filter((t) => t.completed).length;

  return (
    <AppCard padding={spacing.xl} style={styles.card}>
      <View style={styles.header}>
        <AppText variant="label" color={colors.secondary}>
          TODAY'S JOURNEY
        </AppText>
        <AppText variant="caption" color={colors.tertiary}>
          {done}/{tasks.length}
        </AppText>
      </View>

      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onPress={() => onTaskPress(task)} />
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: layout.cardGap,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  taskList: {
    gap: spacing.md,
  },
  taskItem: {
    paddingVertical: spacing.xs,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  taskText: {
    flex: 1,
  },
});
