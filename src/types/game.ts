// Game state types
export type GamePhase = 'waiting' | 'starting' | 'running' | 'crashed';

export interface GameState {
  phase: GamePhase;
  multiplier: number;
  crashPoint: number | null;
  countdown: number;
  roundId: string;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
}

export interface Bet {
  id: string;
  oddesplayerId: string;
  playerName: string;
  amount: number;
  multiplier: number | null;
  cashedOut: boolean;
  profit: number | null;
}

export interface RoundHistory {
  roundId: string;
  crashPoint: number;
  timestamp: number;
}

export interface UserState {
  balance: number;
  currentBet: Bet | null;
  betAmount: number;
  autoCashoutAt: number | null;
  autoCashoutEnabled: boolean;
}
