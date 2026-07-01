/**
 * useHomeData Hook
 * Derives the Home dashboard view-model from live, persisted learning progress.
 */

import { useMemo } from 'react';
import type { HomeData } from '../types';
import { buildHomeData } from '../services/homeDataService';
import { useLearning } from '../../../src/stores/progressStore';

interface UseHomeDataReturn {
  data: HomeData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useHomeData(): UseHomeDataReturn {
  const learning = useLearning();

  const data = useMemo<HomeData | null>(
    () => (learning.hydrated ? buildHomeData(learning) : null),
    [learning]
  );

  return {
    data,
    isLoading: !learning.hydrated,
    error: null,
  };
}
