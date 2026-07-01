/**
 * useDailyTasks Hook
 * Manages daily task completion state.
 */

import { useState, useCallback } from 'react';
import type { DailyTask } from '../types';

export function useDailyTasks(initialTasks: DailyTask[]) {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  return { tasks, toggleTask };
}
