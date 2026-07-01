/**
 * Mirai App Store
 * Global application state managed by Zustand.
 */

import { create } from 'zustand';

interface AppState {
  isReady: boolean;
  isDbInitialized: boolean;
  userName: string;
  currentStreak: number;
  totalMinutesStudied: number;

  // Actions
  setReady: (ready: boolean) => void;
  setDbInitialized: (initialized: boolean) => void;
  setUserName: (name: string) => void;
  setCurrentStreak: (streak: number) => void;
  setTotalMinutesStudied: (minutes: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  isDbInitialized: false,
  userName: 'Learner',
  currentStreak: 0,
  totalMinutesStudied: 0,

  setReady: (ready) => set({ isReady: ready }),
  setDbInitialized: (initialized) => set({ isDbInitialized: initialized }),
  setUserName: (name) => set({ userName: name }),
  setCurrentStreak: (streak) => set({ currentStreak: streak }),
  setTotalMinutesStudied: (minutes) => set({ totalMinutesStudied: minutes }),
}));
