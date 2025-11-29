import { useEffect, useRef, useCallback } from 'react';
import { mockGameEngine } from '../mock/MockGameEngine';
import { useGameStore } from '../store/gameStore';
import { CrashGame } from '../game/CrashGame';
import { Bet, RoundHistory } from '../types/game';

const PLAYER_ID = 'player_1';
const PLAYER_NAME = 'You';

export function useGame() {
  const gameRef = useRef<CrashGame | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const {
    phase,
    multiplier,
    balance,
    currentBet,
    betAmount,
    autoCashoutAt,
    autoCashoutEnabled,
    setPhase,
    setMultiplier,
    setCountdown,
    setCrashPoint,
    setRoundId,
    setCurrentBet,
    setBets,
    setHistory,
    addBalance,
    subtractBalance,
    setBetAmount,
    setAutoCashout
  } = useGameStore();

  // Initialize game engine and PixiJS
  const initGame = useCallback((container: HTMLDivElement) => {
    containerRef.current = container;
    
    // Create PixiJS game
    gameRef.current = new CrashGame(container, {
      width: container.clientWidth,
      height: 500
    });
    
    // Subscribe to mock game engine events
    const unsubscribe = mockGameEngine.subscribe((event, data: unknown) => {
      switch (event) {
        case 'game:state':
          const stateData = data as { history: RoundHistory[] };
          setHistory(stateData.history);
          break;
          
        case 'game:waiting':
          const waitingData = data as { countdown: number; roundId: string };
          setPhase('waiting');
          setMultiplier(1.00);
          setCrashPoint(null);
          setCurrentBet(null);
          setRoundId(waitingData.roundId);
          setCountdown(waitingData.countdown);
          gameRef.current?.setPhase('waiting');
          break;
          
        case 'game:countdown':
          const countdownData = data as { countdown: number };
          setCountdown(countdownData.countdown);
          gameRef.current?.updateCountdown(countdownData.countdown);
          break;
          
        case 'game:starting':
          const startingData = data as { countdown: number };
          setPhase('starting');
          setCountdown(startingData.countdown);
          gameRef.current?.setPhase('starting', { countdown: startingData.countdown });
          break;
          
        case 'game:started':
          setPhase('running');
          gameRef.current?.setPhase('running');
          break;
          
        case 'game:tick':
          const tickData = data as { multiplier: number };
          setMultiplier(tickData.multiplier);
          gameRef.current?.updateMultiplier(tickData.multiplier);
          
          // Check for auto-cashout
          const store = useGameStore.getState();
          if (
            store.autoCashoutEnabled &&
            store.currentBet &&
            !store.currentBet.cashedOut &&
            tickData.multiplier >= store.autoCashoutAt
          ) {
            cashout();
          }
          break;
          
        case 'game:crashed':
          const crashedData = data as { crashPoint: number };
          setPhase('crashed');
          setCrashPoint(crashedData.crashPoint);
          setMultiplier(crashedData.crashPoint);
          gameRef.current?.setPhase('crashed', { crashPoint: crashedData.crashPoint });
          break;
          
        case 'bets:update':
          setBets(data as Bet[]);
          break;
          
        case 'bet:placed':
          const placedBet = data as Bet;
          if (placedBet.oddesplayerId === PLAYER_ID) {
            setCurrentBet(placedBet);
          }
          break;
          
        case 'bet:cashed_out':
          const cashedOutBet = data as Bet;
          if (cashedOutBet.oddesplayerId === PLAYER_ID) {
            setCurrentBet(cashedOutBet);
            if (cashedOutBet.profit) {
              addBalance(cashedOutBet.amount + cashedOutBet.profit);
            }
          }
          break;
          
        case 'history:update':
          setHistory(data as RoundHistory[]);
          break;
      }
    });
    
    // Start the mock game engine
    mockGameEngine.start();
    
    return () => {
      unsubscribe();
      mockGameEngine.stop();
      gameRef.current?.destroy();
    };
  }, []);

  // Place bet
  const placeBet = useCallback(() => {
    const store = useGameStore.getState();
    
    if (store.phase !== 'waiting') {
      console.log('Cannot place bet now');
      return false;
    }
    
    if (store.betAmount > store.balance) {
      console.log('Insufficient balance');
      return false;
    }
    
    if (store.currentBet) {
      console.log('Already have a bet');
      return false;
    }
    
    // Deduct from balance
    subtractBalance(store.betAmount);
    
    // Place bet
    const bet = mockGameEngine.placeBet(PLAYER_ID, PLAYER_NAME, store.betAmount);
    if (bet) {
      setCurrentBet(bet);
      return true;
    }
    
    // Refund if bet failed
    addBalance(store.betAmount);
    return false;
  }, []);

  // Cashout
  const cashout = useCallback(() => {
    const store = useGameStore.getState();
    
    if (store.phase !== 'running') {
      console.log('Cannot cashout now');
      return false;
    }
    
    if (!store.currentBet || store.currentBet.cashedOut) {
      console.log('No active bet to cashout');
      return false;
    }
    
    const success = mockGameEngine.cashout(store.currentBet.id);
    return success;
  }, []);

  // Cancel bet
  const cancelBet = useCallback(() => {
    const store = useGameStore.getState();
    
    if (store.phase !== 'waiting' || !store.currentBet) {
      return false;
    }
    
    // Refund
    addBalance(store.currentBet.amount);
    setCurrentBet(null);
    return true;
  }, []);

  return {
    initGame,
    placeBet,
    cashout,
    cancelBet,
    setBetAmount,
    setAutoCashout,
    phase,
    multiplier,
    balance,
    currentBet,
    betAmount,
    autoCashoutAt,
    autoCashoutEnabled
  };
}
