/**
 * Game Constants
 */

export const GAME_CONFIG = {
  // Timing
  BETTING_PHASE_DURATION: 5000, // 5 seconds
  MIN_MULTIPLIER: 1.0,
  MAX_MULTIPLIER: 100.0,
  MULTIPLIER_INCREMENT: 0.01,
  TICK_RATE: 100, // Update every 100ms

  // Betting
  MIN_BET: 1,
  MAX_BET: 10000,
  DEFAULT_BET: 10,

  // Auto Cashout
  MIN_AUTO_CASHOUT: 1.01,
  MAX_AUTO_CASHOUT: 100.0,
  DEFAULT_AUTO_CASHOUT: 2.0,

  // UI
  HISTORY_LENGTH: 10,
  MAX_ACTIVE_BETS_DISPLAY: 50,
} as const;

export const GAME_STATUS = {
  WAITING: 'waiting',
  BETTING: 'betting',
  STARTING: 'starting',
  FLYING: 'flying',
  CRASHED: 'crashed',
} as const;

export const BET_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CASHED_OUT: 'cashed_out',
  LOST: 'lost',
} as const;

export const WS_EVENTS = {
  // Client to Server
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  PLACE_BET: 'place:bet',
  CASHOUT: 'cashout',
  GET_STATE: 'get:state',
  GET_HISTORY: 'get:history',

  // Server to Client
  GAME_STATE: 'game:state',
  GAME_STARTING: 'game:starting',
  GAME_STARTED: 'game:started',
  GAME_TICK: 'game:tick',
  GAME_CRASHED: 'game:crashed',
  BET_PLACED: 'bet:placed',
  BET_CASHED_OUT: 'bet:cashed_out',
  BET_REJECTED: 'bet:rejected',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',
  HISTORY_UPDATE: 'history:update',
  ERROR: 'error',
} as const;

export const API_ENDPOINTS = {
  GAME_STATE: '/api/game/state',
  GAME_HISTORY: '/api/game/history',
  USER_BALANCE: '/api/user/balance',
  USER_STATS: '/api/user/stats',
  LEADERBOARD: '/api/leaderboard',
} as const;

export const STORAGE_KEYS = {
  BET_AMOUNT: 'crash_game_bet_amount',
  AUTO_CASHOUT: 'crash_game_auto_cashout',
  SOUND_ENABLED: 'crash_game_sound_enabled',
  MUSIC_ENABLED: 'crash_game_music_enabled',
  VOLUME: 'crash_game_volume',
} as const;

export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];
export type BetStatus = typeof BET_STATUS[keyof typeof BET_STATUS];
export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS];
