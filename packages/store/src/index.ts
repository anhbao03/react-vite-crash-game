/**
 * Crash Game Store
 * Zustand-based state management
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
  GAME_CONFIG,
} from '@crash-game/utils';

export interface UserSettings {
  betAmount: number;
  autoCashout: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
}

export interface GameStore {
  // User settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // User balance
  balance: number;
  setBalance: (balance: number) => void;

  // UI state
  showHistory: boolean;
  toggleHistory: () => void;
  showStats: boolean;
  toggleStats: () => void;
}

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    // Initial settings from localStorage
    settings: {
      betAmount: getStorageItem(STORAGE_KEYS.BET_AMOUNT, GAME_CONFIG.DEFAULT_BET),
      autoCashout: getStorageItem(
        STORAGE_KEYS.AUTO_CASHOUT,
        GAME_CONFIG.DEFAULT_AUTO_CASHOUT
      ),
      soundEnabled: getStorageItem(STORAGE_KEYS.SOUND_ENABLED, true),
      musicEnabled: getStorageItem(STORAGE_KEYS.MUSIC_ENABLED, false),
      volume: getStorageItem(STORAGE_KEYS.VOLUME, 0.5),
    },

    updateSettings: (newSettings) =>
      set((state) => {
        state.settings = { ...state.settings, ...newSettings };
        
        // Persist to localStorage
        if (newSettings.betAmount !== undefined) {
          setStorageItem(STORAGE_KEYS.BET_AMOUNT, newSettings.betAmount);
        }
        if (newSettings.autoCashout !== undefined) {
          setStorageItem(STORAGE_KEYS.AUTO_CASHOUT, newSettings.autoCashout);
        }
        if (newSettings.soundEnabled !== undefined) {
          setStorageItem(STORAGE_KEYS.SOUND_ENABLED, newSettings.soundEnabled);
        }
        if (newSettings.musicEnabled !== undefined) {
          setStorageItem(STORAGE_KEYS.MUSIC_ENABLED, newSettings.musicEnabled);
        }
        if (newSettings.volume !== undefined) {
          setStorageItem(STORAGE_KEYS.VOLUME, newSettings.volume);
        }
      }),

    balance: 1000, // Default balance
    setBalance: (balance) =>
      set((state) => {
        state.balance = balance;
      }),

    showHistory: true,
    toggleHistory: () =>
      set((state) => {
        state.showHistory = !state.showHistory;
      }),

    showStats: false,
    toggleStats: () =>
      set((state) => {
        state.showStats = !state.showStats;
      }),
  }))
);
