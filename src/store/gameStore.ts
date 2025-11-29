import { create } from 'zustand';
import { GamePhase, Bet, RoundHistory } from '../types/game';

interface GameStore {
  // Game state
  phase: GamePhase;
  multiplier: number;
  countdown: number;
  crashPoint: number | null;
  roundId: string;
  
  // User state
  balance: number;
  currentBet: Bet | null;
  betAmount: number;
  autoCashoutAt: number;
  autoCashoutEnabled: boolean;
  
  // Game data
  bets: Bet[];
  history: RoundHistory[];
  
  // Actions
  setPhase: (phase: GamePhase) => void;
  setMultiplier: (multiplier: number) => void;
  setCountdown: (countdown: number) => void;
  setCrashPoint: (crashPoint: number | null) => void;
  setRoundId: (roundId: string) => void;
  
  setBalance: (balance: number) => void;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => void;
  
  setCurrentBet: (bet: Bet | null) => void;
  setBetAmount: (amount: number) => void;
  setAutoCashout: (enabled: boolean, multiplier?: number) => void;
  
  setBets: (bets: Bet[]) => void;
  updateBet: (bet: Bet) => void;
  
  setHistory: (history: RoundHistory[]) => void;
  addHistoryEntry: (entry: RoundHistory) => void;
  
  // Reset
  reset: () => void;
}

const INITIAL_BALANCE = 10000; // Start with 10,000 for testing

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  phase: 'waiting',
  multiplier: 1.00,
  countdown: 5,
  crashPoint: null,
  roundId: '',
  
  balance: INITIAL_BALANCE,
  currentBet: null,
  betAmount: 100,
  autoCashoutAt: 2.00,
  autoCashoutEnabled: false,
  
  bets: [],
  history: [],
  
  // Game state actions
  setPhase: (phase) => set({ phase }),
  setMultiplier: (multiplier) => {
    set({ multiplier });
    
    // Auto-cashout logic
    const state = get();
    if (
      state.autoCashoutEnabled &&
      state.currentBet &&
      !state.currentBet.cashedOut &&
      multiplier >= state.autoCashoutAt
    ) {
      // Trigger auto-cashout (handled by component)
      console.log(`🤖 Auto-cashout triggered at ${multiplier}x`);
    }
  },
  setCountdown: (countdown) => set({ countdown }),
  setCrashPoint: (crashPoint) => set({ crashPoint }),
  setRoundId: (roundId) => set({ roundId }),
  
  // Balance actions
  setBalance: (balance) => set({ balance }),
  addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  subtractBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
  
  // Bet actions
  setCurrentBet: (bet) => set({ currentBet: bet }),
  setBetAmount: (amount) => set({ betAmount: Math.max(1, amount) }),
  setAutoCashout: (enabled, multiplier) => set((state) => ({
    autoCashoutEnabled: enabled,
    autoCashoutAt: multiplier !== undefined ? multiplier : state.autoCashoutAt
  })),
  
  // Bets list actions
  setBets: (bets) => set({ bets }),
  updateBet: (updatedBet) => set((state) => ({
    bets: state.bets.map(bet => bet.id === updatedBet.id ? updatedBet : bet)
  })),
  
  // History actions
  setHistory: (history) => set({ history }),
  addHistoryEntry: (entry) => set((state) => ({
    history: [entry, ...state.history].slice(0, 20)
  })),
  
  // Reset
  reset: () => set({
    phase: 'waiting',
    multiplier: 1.00,
    countdown: 5,
    crashPoint: null,
    currentBet: null,
    bets: []
  })
}));
