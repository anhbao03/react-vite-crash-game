/**
 * WebSocket Client Types
 */

import type { GameStatus, BetStatus } from '@crash-game/utils';

export interface Player {
  id: string;
  username: string;
  avatar?: string;
}

export interface PlayerBet {
  id: string;
  playerId: string;
  playerName: string;
  amount: number;
  autoCashout?: number;
  cashoutMultiplier?: number;
  profit?: number;
  status: BetStatus;
  timestamp: number;
}

export interface GameRound {
  roundId: string;
  roundNumber: number;
  status: GameStatus;
  currentMultiplier: number;
  crashPoint?: number;
  startTime?: number;
  endTime?: number;
  bets: PlayerBet[];
}

export interface HistoryRound {
  roundId: string;
  roundNumber: number;
  crashPoint: number;
  startTime: number;
  endTime: number;
  totalBets: number;
  totalWagered: number;
}

export interface UserBalance {
  balance: number;
  currency: string;
}

export interface BetPlacedData {
  success: boolean;
  bet?: PlayerBet;
  error?: string;
}

export interface CashoutData {
  success: boolean;
  bet?: PlayerBet;
  profit?: number;
  error?: string;
}

export interface GameStateData {
  round: GameRound;
  balance?: UserBalance;
}

export interface GameTickData {
  roundId: string;
  multiplier: number;
  elapsedTime: number;
}

export interface GameCrashedData {
  roundId: string;
  crashPoint: number;
  winners: PlayerBet[];
  losers: PlayerBet[];
}

export interface PlaceBetPayload {
  amount: number;
  autoCashout?: number;
}

export interface CashoutPayload {
  betId: string;
}

export type WSEventCallback<T = any> = (data: T) => void;

export interface WSEventMap {
  // Connection events
  connect: () => void;
  disconnect: (reason: string) => void;
  error: (error: Error) => void;

  // Game events
  'game:state': WSEventCallback<GameStateData>;
  'game:starting': WSEventCallback<{ countdown: number }>;
  'game:started': WSEventCallback<{ roundId: string; startTime: number }>;
  'game:tick': WSEventCallback<GameTickData>;
  'game:crashed': WSEventCallback<GameCrashedData>;

  // Bet events
  'bet:placed': WSEventCallback<BetPlacedData>;
  'bet:cashed_out': WSEventCallback<CashoutData>;
  'bet:rejected': WSEventCallback<{ reason: string }>;

  // Player events
  'player:joined': WSEventCallback<Player>;
  'player:left': WSEventCallback<{ playerId: string }>;

  // History events
  'history:update': WSEventCallback<{ history: HistoryRound[] }>;
}
