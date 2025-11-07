/**
 * Validation utilities
 */

import { GAME_CONFIG } from './constants';

/**
 * Validate bet amount
 */
export function validateBetAmount(amount: number): {
  valid: boolean;
  error?: string;
} {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, error: 'Bet amount must be a positive number' };
  }

  if (amount < GAME_CONFIG.MIN_BET) {
    return {
      valid: false,
      error: `Minimum bet is ${GAME_CONFIG.MIN_BET}`,
    };
  }

  if (amount > GAME_CONFIG.MAX_BET) {
    return {
      valid: false,
      error: `Maximum bet is ${GAME_CONFIG.MAX_BET}`,
    };
  }

  return { valid: true };
}

/**
 * Validate auto-cashout multiplier
 */
export function validateAutoCashout(multiplier: number): {
  valid: boolean;
  error?: string;
} {
  if (isNaN(multiplier) || multiplier <= 0) {
    return { valid: false, error: 'Auto-cashout must be a positive number' };
  }

  if (multiplier < GAME_CONFIG.MIN_AUTO_CASHOUT) {
    return {
      valid: false,
      error: `Minimum auto-cashout is ${GAME_CONFIG.MIN_AUTO_CASHOUT}x`,
    };
  }

  if (multiplier > GAME_CONFIG.MAX_AUTO_CASHOUT) {
    return {
      valid: false,
      error: `Maximum auto-cashout is ${GAME_CONFIG.MAX_AUTO_CASHOUT}x`,
    };
  }

  return { valid: true };
}

/**
 * Validate user balance for bet
 */
export function validateBalance(
  betAmount: number,
  balance: number
): {
  valid: boolean;
  error?: string;
} {
  if (betAmount > balance) {
    return { valid: false, error: 'Insufficient balance' };
  }

  return { valid: true };
}

/**
 * Sanitize number input
 */
export function sanitizeNumberInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Check if value is within range
 */
export function isInRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username (alphanumeric, 3-20 chars)
 */
export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { valid: true };
}
