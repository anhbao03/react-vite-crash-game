import { forwardRef } from 'react';
import { formatMultiplier } from '@crash-game/utils';
import type { GameStatus } from '@crash-game/utils';

interface GameState {
  status: GameStatus;
  currentMultiplier: number;
  crashPoint?: number | null;
}

interface GameCanvasProps {
  gameState: GameState;
  isConnected: boolean;
}

export const GameCanvas = forwardRef<HTMLDivElement, GameCanvasProps>(
  ({ gameState, isConnected }, ref) => {
    const getStatusColor = () => {
      switch (gameState.status) {
        case 'betting':
          return 'text-success-500';
        case 'starting':
          return 'text-warning-500';
        case 'flying':
          return 'text-primary-500';
        case 'crashed':
          return 'text-danger-500';
        default:
          return 'text-dark-400';
      }
    };

    const getStatusText = () => {
      switch (gameState.status) {
        case 'waiting':
          return 'Waiting for round...';
        case 'betting':
          return 'Place your bets!';
        case 'starting':
          return 'Starting...';
        case 'flying':
          return 'FLYING!';
        case 'crashed':
          return `CRASHED at ${formatMultiplier(gameState.crashPoint || 0)}`;
        default:
          return 'Connecting...';
      }
    };

    return (
      <div className="card relative flex-1 overflow-hidden min-h-[400px]">
        {/* PixiJS Canvas Container */}
        <div 
          ref={ref} 
          className="w-full h-full absolute inset-0"
        />

        {/* Overlay UI */}
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 z-10">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-lg text-dark-300">Connecting to game server...</p>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute top-4 left-4 z-10">
          <div className={`text-sm font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </div>
        </div>

        {/* Multiplier Display (when flying) */}
        {gameState.status === 'flying' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="text-7xl font-bold text-glow animate-pulse-glow" 
                 style={{ 
                   color: gameState.currentMultiplier < 2 ? '#10b981' :
                          gameState.currentMultiplier < 5 ? '#3b82f6' :
                          gameState.currentMultiplier < 10 ? '#8b5cf6' : '#ec4899'
                 }}>
              {formatMultiplier(gameState.currentMultiplier)}
            </div>
          </div>
        )}
      </div>
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
