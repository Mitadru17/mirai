/**
 * useHomeData Hook
 * Fetches and manages all home screen data.
 */

import { useState, useEffect } from 'react';
import type { HomeData } from '../types';
import { getHomeData } from '../services/homeDataService';

interface UseHomeDataReturn {
  data: HomeData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useHomeData(): UseHomeDataReturn {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Simulate async fetch
        await new Promise((resolve) => setTimeout(resolve, 100));
        const homeData = getHomeData();
        setData(homeData);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load home data'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}
