/**
 * useBetting Hook
 * React hook for betting operations
 */

import { useEffect, useState, useCallback } from 'react';
import type { WebSocketClient } from '../WebSocketClient';
import type { PlayerBet, BetPlacedData, CashoutData } from '../types';

export interface UseBettingOptions {
  client: WebSocketClient | null;
}

export function useBetting({ client }: UseBettingOptions) {
  const [currentBet, setCurrentBet] = useState<PlayerBet | null>(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [betError, setBetError] = useState<string | null>(null);
  const [lastProfit, setLastProfit] = useState<number | null>(null);

  useEffect(() => {
    if (!client) return;

    // Bet placed
    const handleBetPlaced = (data: BetPlacedData) => {
      setIsPlacingBet(false);
      if (data.success && data.bet) {
        setCurrentBet(data.bet);
        setBetError(null);
      } else {
        setBetError(data.error || 'Failed to place bet');
      }
    };

    // Bet cashed out
    const handleBetCashedOut = (data: CashoutData) => {
      setIsCashingOut(false);
      if (data.success && data.bet) {
        setCurrentBet(null);
        setLastProfit(data.profit || 0);
        setBetError(null);
      } else {
        setBetError(data.error || 'Failed to cashout');
      }
    };

    // Bet rejected
    const handleBetRejected = (data: { reason: string }) => {
      setIsPlacingBet(false);
      setBetError(data.reason);
    };

    // Game crashed - clear bet if lost
    const handleGameCrashed = () => {
      if (currentBet && currentBet.status === 'active') {
        setCurrentBet(null);
      }
      setIsCashingOut(false);
    };

    // Register listeners
    client.on('bet:placed', handleBetPlaced);
    client.on('bet:cashed_out', handleBetCashedOut);
    client.on('bet:rejected', handleBetRejected);
    client.on('game:crashed', handleGameCrashed);

    // Cleanup
    return () => {
      client.off('bet:placed', handleBetPlaced);
      client.off('bet:cashed_out', handleBetCashedOut);
      client.off('bet:rejected', handleBetRejected);
      client.off('game:crashed', handleGameCrashed);
    };
  }, [client, currentBet]);

  // Place bet
  const placeBet = useCallback(
    (amount: number, autoCashout?: number) => {
      if (!client) {
        setBetError('Not connected to server');
        return;
      }

      if (currentBet) {
        setBetError('Already have an active bet');
        return;
      }

      setIsPlacingBet(true);
      setBetError(null);
      client.placeBet({ amount, autoCashout });
    },
    [client, currentBet]
  );

  // Cashout
  const cashout = useCallback(() => {
    if (!client) {
      setBetError('Not connected to server');
      return;
    }

    if (!currentBet) {
      setBetError('No active bet to cashout');
      return;
    }

    setIsCashingOut(true);
    setBetError(null);
    client.cashout({ betId: currentBet.id });
  }, [client, currentBet]);

  // Clear error
  const clearError = useCallback(() => {
    setBetError(null);
  }, []);

  // Clear last profit
  const clearLastProfit = useCallback(() => {
    setLastProfit(null);
  }, []);

  return {
    currentBet,
    isPlacingBet,
    isCashingOut,
    betError,
    lastProfit,
    hasBet: currentBet !== null,
    placeBet,
    cashout,
    clearError,
    clearLastProfit,
  };
}
