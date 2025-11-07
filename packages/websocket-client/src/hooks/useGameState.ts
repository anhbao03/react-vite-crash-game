/**
 * useGameState Hook
 * React hook for accessing game state
 */

import { useEffect, useState } from 'react';
import type { WebSocketClient } from '../WebSocketClient';
import type { GameRound, GameTickData, GameCrashedData } from '../types';
import type { GameStatus } from '@crash-game/utils';

export interface UseGameStateOptions {
  client: WebSocketClient | null;
}

export function useGameState({ client }: UseGameStateOptions) {
  const [round, setRound] = useState<GameRound | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [status, setStatus] = useState<GameStatus>('waiting');
  const [crashPoint, setCrashPoint] = useState<number | null>(null);

  useEffect(() => {
    if (!client) return;

    // Game state
    const handleGameState = (data: { round: GameRound }) => {
      setRound(data.round);
      setStatus(data.round.status);
      setCurrentMultiplier(data.round.currentMultiplier);
      setCrashPoint(data.round.crashPoint ?? null);
    };

    // Game starting
    const handleGameStarting = () => {
      setStatus('starting');
      setCurrentMultiplier(1.0);
      setElapsedTime(0);
      setCrashPoint(null);
    };

    // Game started
    const handleGameStarted = () => {
      setStatus('flying');
      setCurrentMultiplier(1.0);
      setElapsedTime(0);
      setCrashPoint(null);
    };

    // Game tick
    const handleGameTick = (data: GameTickData) => {
      setCurrentMultiplier(data.multiplier);
      setElapsedTime(data.elapsedTime);
    };

    // Game crashed
    const handleGameCrashed = (data: GameCrashedData) => {
      setStatus('crashed');
      setCrashPoint(data.crashPoint);
    };

    // Register listeners
    client.on('game:state', handleGameState);
    client.on('game:starting', handleGameStarting);
    client.on('game:started', handleGameStarted);
    client.on('game:tick', handleGameTick);
    client.on('game:crashed', handleGameCrashed);

    // Cleanup
    return () => {
      client.off('game:state', handleGameState);
      client.off('game:starting', handleGameStarting);
      client.off('game:started', handleGameStarted);
      client.off('game:tick', handleGameTick);
      client.off('game:crashed', handleGameCrashed);
    };
  }, [client]);

  return {
    round,
    currentMultiplier,
    elapsedTime,
    status,
    crashPoint,
    isWaiting: status === 'waiting',
    isBetting: status === 'betting',
    isStarting: status === 'starting',
    isFlying: status === 'flying',
    isCrashed: status === 'crashed',
  };
}
