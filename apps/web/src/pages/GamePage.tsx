import { useEffect, useRef, useState } from 'react';
import { Game } from '@crash-game/game-engine';
import { useWebSocket, useGameState, useBetting } from '@crash-game/websocket-client';
import { useGameStore } from '@crash-game/store';
import { BetControls } from '../components/BetControls';
import { ActiveBets } from '../components/ActiveBets';
import { History } from '../components/History';
import { Header } from '../components/Header';
import { GameCanvas } from '../components/GameCanvas';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/game';

export function GamePage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [isGameInitialized, setIsGameInitialized] = useState(false);

  // WebSocket connection
  const { client, isConnected, connectionStatus } = useWebSocket({
    url: WS_URL,
    autoConnect: true,
    debug: true,
  });

  // Game state from WebSocket
  const gameState = useGameState({ client });
  
  // Betting hooks
  const betting = useBetting({ client });

  // Store
  const { balance } = useGameStore();

  // Initialize PixiJS game
  useEffect(() => {
    if (!canvasRef.current || isGameInitialized) return;

    const initGame = async () => {
      try {
        const game = new Game(canvasRef.current!, {
          width: canvasRef.current!.clientWidth,
          height: canvasRef.current!.clientHeight,
          backgroundColor: 0x0f172a,
          antialias: true,
          autoResize: true,
        });

        await game.init();
        gameRef.current = game;
        setIsGameInitialized(true);

        console.log('✅ Game initialized');
      } catch (error) {
        console.error('❌ Failed to initialize game:', error);
      }
    };

    initGame();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
        gameRef.current = null;
      }
    };
  }, [isGameInitialized]);

  // Sync game engine with game state
  useEffect(() => {
    if (!gameRef.current) return;

    const game = gameRef.current;

    switch (gameState.status) {
      case 'betting':
        game.reset();
        break;
      case 'starting':
        // Prepare for flight
        break;
      case 'flying':
        game.startFlying();
        break;
      case 'crashed':
        if (gameState.crashPoint) {
          game.crash(gameState.crashPoint);
        }
        break;
    }
  }, [gameState.status]);

  // Update multiplier during flight
  useEffect(() => {
    if (gameState.isFlying && gameRef.current) {
      gameRef.current.updateMultiplier(
        gameState.currentMultiplier,
        gameState.elapsedTime
      );
    }
  }, [gameState.currentMultiplier, gameState.elapsedTime, gameState.isFlying]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header 
        balance={balance}
        isConnected={isConnected}
        connectionStatus={connectionStatus}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Left Column - Game Canvas */}
        <div className="flex-1 flex flex-col gap-4">
          <GameCanvas 
            ref={canvasRef}
            gameState={gameState}
            isConnected={isConnected}
          />
        </div>

        {/* Right Column - Bet Controls */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <BetControls
            gameState={gameState}
            betting={betting}
            balance={balance}
            disabled={!isConnected || betting.isPlacingBet}
          />

          {/* Active Bets */}
          <ActiveBets
            bets={gameState.round?.bets || []}
            currentMultiplier={gameState.currentMultiplier}
          />
        </div>
      </div>

      {/* Bottom - History */}
      <div className="p-4 pt-0">
        <History />
      </div>
    </div>
  );
}
