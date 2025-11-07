/**
 * WebSocket Client
 * Handles WebSocket connection and event management
 */

import { io, Socket } from 'socket.io-client';
import { WS_EVENTS } from '@crash-game/utils';
import type {
  WSEventMap,
  PlaceBetPayload,
  CashoutPayload,
} from './types';

export interface WebSocketClientConfig {
  url: string;
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  debug?: boolean;
}

export class WebSocketClient {
  private socket: Socket | null = null;
  private config: Required<WebSocketClientConfig>;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts = 0;

  constructor(config: WebSocketClientConfig) {
    this.config = {
      autoConnect: config.autoConnect ?? true,
      reconnectionAttempts: config.reconnectionAttempts ?? 5,
      reconnectionDelay: config.reconnectionDelay ?? 1000,
      debug: config.debug ?? false,
      url: config.url,
    };
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): void {
    if (this.socket?.connected) {
      this.log('Already connected');
      return;
    }

    this.log(`Connecting to ${this.config.url}...`);

    this.socket = io(this.config.url, {
      autoConnect: this.config.autoConnect,
      reconnection: true,
      reconnectionAttempts: this.config.reconnectionAttempts,
      reconnectionDelay: this.config.reconnectionDelay,
      transports: ['websocket', 'polling'],
    });

    this.setupInternalListeners();
    this.socket.connect();
  }

  /**
   * Disconnect from server
   */
  public disconnect(): void {
    if (this.socket) {
      this.log('Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Setup internal socket.io listeners
   */
  private setupInternalListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.log('✅ Connected to server');
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason: string) => {
      this.log(`❌ Disconnected: ${reason}`);
      this.emit('disconnect', reason);
    });

    this.socket.on('connect_error', (error: Error) => {
      this.reconnectAttempts++;
      this.log(`Connection error (attempt ${this.reconnectAttempts}):`, error);
      this.emit('error', error);
    });

    // Setup game event listeners
    this.socket.on(WS_EVENTS.GAME_STATE, (data) => {
      this.log('Game state:', data);
      this.emit('game:state', data);
    });

    this.socket.on(WS_EVENTS.GAME_STARTING, (data) => {
      this.log('Game starting:', data);
      this.emit('game:starting', data);
    });

    this.socket.on(WS_EVENTS.GAME_STARTED, (data) => {
      this.log('Game started:', data);
      this.emit('game:started', data);
    });

    this.socket.on(WS_EVENTS.GAME_TICK, (data) => {
      this.emit('game:tick', data);
    });

    this.socket.on(WS_EVENTS.GAME_CRASHED, (data) => {
      this.log('Game crashed:', data);
      this.emit('game:crashed', data);
    });

    this.socket.on(WS_EVENTS.BET_PLACED, (data) => {
      this.log('Bet placed:', data);
      this.emit('bet:placed', data);
    });

    this.socket.on(WS_EVENTS.BET_CASHED_OUT, (data) => {
      this.log('Bet cashed out:', data);
      this.emit('bet:cashed_out', data);
    });

    this.socket.on(WS_EVENTS.BET_REJECTED, (data) => {
      this.log('Bet rejected:', data);
      this.emit('bet:rejected', data);
    });

    this.socket.on(WS_EVENTS.PLAYER_JOINED, (data) => {
      this.log('Player joined:', data);
      this.emit('player:joined', data);
    });

    this.socket.on(WS_EVENTS.PLAYER_LEFT, (data) => {
      this.log('Player left:', data);
      this.emit('player:left', data);
    });

    this.socket.on(WS_EVENTS.HISTORY_UPDATE, (data) => {
      this.emit('history:update', data);
    });

    this.socket.on(WS_EVENTS.ERROR, (data) => {
      this.log('Server error:', data);
      this.emit('error', new Error(data.message));
    });
  }

  /**
   * Place a bet
   */
  public placeBet(payload: PlaceBetPayload): void {
    if (!this.socket?.connected) {
      this.log('Cannot place bet: not connected');
      return;
    }

    this.log('Placing bet:', payload);
    this.socket.emit(WS_EVENTS.PLACE_BET, payload);
  }

  /**
   * Cashout current bet
   */
  public cashout(payload: CashoutPayload): void {
    if (!this.socket?.connected) {
      this.log('Cannot cashout: not connected');
      return;
    }

    this.log('Cashing out:', payload);
    this.socket.emit(WS_EVENTS.CASHOUT, payload);
  }

  /**
   * Request current game state
   */
  public getState(): void {
    if (!this.socket?.connected) {
      this.log('Cannot get state: not connected');
      return;
    }

    this.socket.emit(WS_EVENTS.GET_STATE);
  }

  /**
   * Request game history
   */
  public getHistory(limit?: number): void {
    if (!this.socket?.connected) {
      this.log('Cannot get history: not connected');
      return;
    }

    this.socket.emit(WS_EVENTS.GET_HISTORY, { limit });
  }

  /**
   * Add event listener
   */
  public on<K extends keyof WSEventMap>(
    event: K,
    callback: WSEventMap[K]
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * Remove event listener
   */
  public off<K extends keyof WSEventMap>(
    event: K,
    callback: WSEventMap[K]
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  /**
   * Remove all listeners for an event
   */
  public removeAllListeners(event?: keyof WSEventMap): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          this.log(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get connection status
   */
  public getStatus(): 'connected' | 'disconnected' | 'connecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    return 'connecting';
  }

  /**
   * Debug logging
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WebSocketClient]', ...args);
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.disconnect();
    this.removeAllListeners();
  }
}
