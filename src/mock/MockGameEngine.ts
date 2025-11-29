import { GamePhase, GameState, Bet, RoundHistory } from '../types/game';

type GameEventCallback = (event: string, data: unknown) => void;

/**
 * Mock Game Engine for development
 * Simulates the backend WebSocket behavior
 */
export class MockGameEngine {
  private gameState: GameState;
  private bets: Map<string, Bet> = new Map();
  private history: RoundHistory[] = [];
  private callbacks: GameEventCallback[] = [];
  private gameLoop: number | null = null;
  private tickInterval: number | null = null;
  
  // Game timing configuration
  private readonly WAITING_TIME = 5000;    // 5 seconds between rounds
  private readonly COUNTDOWN_TIME = 3000;  // 3 second countdown
  private readonly TICK_RATE = 50;         // 50ms = 20 ticks per second
  private readonly MULTIPLIER_GROWTH = 0.0015; // Growth rate per tick
  
  constructor() {
    this.gameState = {
      phase: 'waiting',
      multiplier: 1.00,
      crashPoint: null,
      countdown: 5,
      roundId: this.generateRoundId()
    };
    
    // Generate initial history
    this.generateInitialHistory();
  }
  
  private generateRoundId(): string {
    return `round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateCrashPoint(): number {
    // Generate crash point using exponential distribution
    // This creates a house edge of about 3-4%
    const e = 2 ** 32;
    const h = Math.floor(Math.random() * e);
    
    // Instant crash chance (1%)
    if (h % 33 === 0) return 1.00;
    
    // Calculate crash point
    const crashPoint = Math.floor((100 * e - h) / (e - h)) / 100;
    return Math.max(1.00, Math.min(crashPoint, 100));
  }
  
  private generateInitialHistory(): void {
    for (let i = 0; i < 10; i++) {
      this.history.push({
        roundId: `history_${i}`,
        crashPoint: this.generateCrashPoint(),
        timestamp: Date.now() - (10 - i) * 30000
      });
    }
  }
  
  public subscribe(callback: GameEventCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
  
  private emit(event: string, data: unknown): void {
    this.callbacks.forEach(cb => cb(event, data));
  }
  
  public start(): void {
    console.log('🎮 Mock Game Engine Started');
    this.emit('game:state', {
      ...this.gameState,
      history: this.history,
      bets: Array.from(this.bets.values())
    });
    this.startGameLoop();
  }
  
  public stop(): void {
    if (this.gameLoop) {
      clearTimeout(this.gameLoop);
      this.gameLoop = null;
    }
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    console.log('🛑 Mock Game Engine Stopped');
  }
  
  private startGameLoop(): void {
    this.runWaitingPhase();
  }
  
  private runWaitingPhase(): void {
    this.gameState.phase = 'waiting';
    this.gameState.multiplier = 1.00;
    this.gameState.crashPoint = this.generateCrashPoint();
    this.gameState.roundId = this.generateRoundId();
    this.bets.clear();
    
    // Add some mock bets from "other players"
    this.addMockBets();
    
    this.emit('game:waiting', { 
      countdown: this.WAITING_TIME / 1000,
      roundId: this.gameState.roundId
    });
    
    let countdown = this.WAITING_TIME / 1000;
    const countdownInterval = setInterval(() => {
      countdown--;
      this.gameState.countdown = countdown;
      this.emit('game:countdown', { countdown });
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        this.runStartingPhase();
      }
    }, 1000);
  }
  
  private addMockBets(): void {
    const mockPlayers = [
      { id: 'bot_1', name: 'CryptoKing', amount: 100 },
      { id: 'bot_2', name: 'LuckyPlayer', amount: 50 },
      { id: 'bot_3', name: 'HighRoller', amount: 500 },
      { id: 'bot_4', name: 'SafePlayer', amount: 25 },
      { id: 'bot_5', name: 'RiskTaker', amount: 200 },
    ];
    
    // Randomly add 2-4 mock bets
    const numBets = Math.floor(Math.random() * 3) + 2;
    const shuffled = mockPlayers.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numBets; i++) {
      const player = shuffled[i];
      const bet: Bet = {
        id: `bet_${player.id}_${Date.now()}`,
        oddesplayerId: player.id,
        playerName: player.name,
        amount: player.amount * (Math.random() * 0.5 + 0.75), // Vary amount
        multiplier: null,
        cashedOut: false,
        profit: null
      };
      this.bets.set(bet.id, bet);
    }
    
    this.emit('bets:update', Array.from(this.bets.values()));
  }
  
  private runStartingPhase(): void {
    this.gameState.phase = 'starting';
    this.gameState.countdown = 3;
    
    this.emit('game:starting', { countdown: 3 });
    
    let countdown = 3;
    const startInterval = setInterval(() => {
      countdown--;
      this.gameState.countdown = countdown;
      this.emit('game:countdown', { countdown });
      
      if (countdown <= 0) {
        clearInterval(startInterval);
        this.runGamePhase();
      }
    }, 1000);
  }
  
  private runGamePhase(): void {
    this.gameState.phase = 'running';
    this.gameState.multiplier = 1.00;
    
    this.emit('game:started', { 
      roundId: this.gameState.roundId 
    });
    
    const startTime = Date.now();
    
    this.tickInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // Exponential growth formula
      this.gameState.multiplier = Math.pow(Math.E, this.MULTIPLIER_GROWTH * elapsed / 10);
      this.gameState.multiplier = Math.floor(this.gameState.multiplier * 100) / 100;
      
      // Check if crashed
      if (this.gameState.multiplier >= this.gameState.crashPoint!) {
        this.runCrashedPhase();
        return;
      }
      
      // Simulate bot cashouts
      this.simulateBotCashouts();
      
      this.emit('game:tick', { 
        multiplier: this.gameState.multiplier,
        elapsed
      });
    }, this.TICK_RATE) as unknown as number;
  }
  
  private simulateBotCashouts(): void {
    const currentMultiplier = this.gameState.multiplier;
    
    this.bets.forEach((bet, betId) => {
      if (bet.oddesplayerId.startsWith('bot_') && !bet.cashedOut) {
        // Random cashout logic for bots
        const cashoutChance = (currentMultiplier - 1) * 0.05;
        if (Math.random() < cashoutChance) {
          bet.cashedOut = true;
          bet.multiplier = currentMultiplier;
          bet.profit = bet.amount * currentMultiplier - bet.amount;
          this.emit('bet:cashed_out', bet);
          this.emit('bets:update', Array.from(this.bets.values()));
        }
      }
    });
  }
  
  private runCrashedPhase(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    
    this.gameState.phase = 'crashed';
    this.gameState.multiplier = this.gameState.crashPoint!;
    
    // Mark all uncashed bets as lost
    this.bets.forEach((bet) => {
      if (!bet.cashedOut) {
        bet.multiplier = 0;
        bet.profit = -bet.amount;
      }
    });
    
    // Add to history
    this.history.unshift({
      roundId: this.gameState.roundId,
      crashPoint: this.gameState.crashPoint!,
      timestamp: Date.now()
    });
    
    // Keep only last 20 entries
    if (this.history.length > 20) {
      this.history = this.history.slice(0, 20);
    }
    
    this.emit('game:crashed', { 
      crashPoint: this.gameState.crashPoint,
      roundId: this.gameState.roundId
    });
    
    this.emit('history:update', this.history);
    this.emit('bets:update', Array.from(this.bets.values()));
    
    // Start next round after delay
    this.gameLoop = setTimeout(() => {
      this.runWaitingPhase();
    }, 3000) as unknown as number;
  }
  
  // Public methods for player actions
  public placeBet(playerId: string, playerName: string, amount: number): Bet | null {
    if (this.gameState.phase !== 'waiting') {
      console.log('❌ Cannot place bet during this phase');
      return null;
    }
    
    const bet: Bet = {
      id: `bet_${playerId}_${Date.now()}`,
      oddesplayerId: playerId,
      playerName,
      amount,
      multiplier: null,
      cashedOut: false,
      profit: null
    };
    
    this.bets.set(bet.id, bet);
    this.emit('bet:placed', bet);
    this.emit('bets:update', Array.from(this.bets.values()));
    
    console.log(`✅ Bet placed: ${amount} by ${playerName}`);
    return bet;
  }
  
  public cashout(betId: string): boolean {
    if (this.gameState.phase !== 'running') {
      console.log('❌ Cannot cashout during this phase');
      return false;
    }
    
    const bet = this.bets.get(betId);
    if (!bet || bet.cashedOut) {
      console.log('❌ Bet not found or already cashed out');
      return false;
    }
    
    bet.cashedOut = true;
    bet.multiplier = this.gameState.multiplier;
    bet.profit = bet.amount * this.gameState.multiplier - bet.amount;
    
    this.emit('bet:cashed_out', bet);
    this.emit('bets:update', Array.from(this.bets.values()));
    
    console.log(`💰 Cashed out at ${this.gameState.multiplier}x - Profit: ${bet.profit?.toFixed(2)}`);
    return true;
  }
  
  public getState(): GameState {
    return { ...this.gameState };
  }
  
  public getBets(): Bet[] {
    return Array.from(this.bets.values());
  }
  
  public getHistory(): RoundHistory[] {
    return [...this.history];
  }
  
  public getPlayerBet(playerId: string): Bet | undefined {
    return Array.from(this.bets.values()).find(
      bet => bet.oddesplayerId === playerId && !bet.oddesplayerId.startsWith('bot_')
    );
  }
}

// Singleton instance
export const mockGameEngine = new MockGameEngine();
