/**
 * Today's Journey Card
 * Shows three daily tasks with completion status.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckCircle2, Circle } from 'lucide-react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { AppCard, AppText, AnimatedPressable } from '../../../src/components/ui';
import { useColors } from '../../../src/theme/ThemeContext';
import { spacing, layout } from '../../../src/theme/spacing';
import { animations } from '../../../src/theme/animations';
import type { DailyTask } from '../types';

interface TodaysJourneyCardProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
}

interface TaskItemProps {
  task: DailyTask;
  onToggle: () => void;
}

function TaskItem({ task, onToggle }: TaskItemProps) {
  const colors = useColors();
  const Icon = task.completed ? CheckCircle2 : Circle;
  const iconColor = task.completed ? colors.accent.lime : colors.tertiary;

  return (
    <AnimatedPressable
      onPress={onToggle}
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
      </View>
    </AnimatedPressable>
  );
}

export function TodaysJourneyCard({ tasks, onToggleTask }: TodaysJourneyCardProps) {
  const colors = useColors();

  return (
    <AppCard padding={spacing.xl} style={styles.card}>
      <AppText variant="label" color={colors.secondary} style={styles.label}>
        TODAY'S JOURNEY
      </AppText>
      
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </View>
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
