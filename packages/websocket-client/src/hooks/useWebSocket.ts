/**
 * useWebSocket Hook
 * React hook for managing WebSocket connection
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient } from '../WebSocketClient';
import type { GameStateData } from '../types';

export interface UseWebSocketOptions {
  url: string;
  autoConnect?: boolean;
  debug?: boolean;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connected' | 'disconnected' | 'connecting'
  >('disconnected');
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef<WebSocketClient | null>(null);

  // Initialize WebSocket client
  useEffect(() => {
    const client = new WebSocketClient({
      url: options.url,
      autoConnect: options.autoConnect ?? true,
      debug: options.debug ?? false,
    });

    clientRef.current = client;

    // Setup event listeners
    client.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      options.onConnect?.();

      // Request initial game state
      client.getState();
    });

    client.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
      options.onDisconnect?.(reason);
    });

    client.on('error', (err) => {
      setError(err);
      options.onError?.(err);
    });

    client.on('game:state', (data) => {
      setGameState(data);
    });

    // Connect
    client.connect();

    // Cleanup
    return () => {
      client.destroy();
    };
  }, [options.url]);

  // Place bet callback
  const placeBet = useCallback((amount: number, autoCashout?: number) => {
    if (clientRef.current) {
      clientRef.current.placeBet({ amount, autoCashout });
    }
  }, []);

  // Cashout callback
  const cashout = useCallback((betId: string) => {
    if (clientRef.current) {
      clientRef.current.cashout({ betId });
    }
  }, []);

  // Get state callback
  const refreshState = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.getState();
    }
  }, []);

  // Get history callback
  const getHistory = useCallback((limit?: number) => {
    if (clientRef.current) {
      clientRef.current.getHistory(limit);
    }
  }, []);

  return {
    client: clientRef.current,
    isConnected,
    connectionStatus,
    gameState,
    error,
    placeBet,
    cashout,
    refreshState,
    getHistory,
  };
}
