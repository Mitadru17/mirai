/**
 * Mirai UI Store
 * UI-specific state (modals, loading, etc.)
 */

import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  activeTab: string;
  modalVisible: boolean;
  modalContent: string | null;

  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  showModal: (content: string) => void;
  hideModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  activeTab: 'home',
  modalVisible: false,
  modalContent: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  showModal: (content) => set({ modalVisible: true, modalContent: content }),
  hideModal: () => set({ modalVisible: false, modalContent: null }),
}));
