import React, { useEffect, useRef } from 'react';
import { useGame } from './hooks/useGame';
import { GameCanvas } from './components/GameCanvas';
import { BetControls } from './components/BetControls';
import { ActiveBets } from './components/ActiveBets';
import { History } from './components/History';

function App() {
  const {
    initGame,
    placeBet,
    cashout,
    cancelBet
  } = useGame();
  
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleInit = (container: HTMLDivElement) => {
    cleanupRef.current = initGame(container);
  };

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-game-bg text-white">
      {/* Header */}
      <header className="bg-game-panel border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-game-green to-game-gold bg-clip-text text-transparent">
              Crash Game
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            <span className="text-game-green">●</span> Mock Mode (Development)
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Area - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Canvas */}
            <div className="bg-game-panel rounded-lg p-4">
              <GameCanvas onInit={handleInit} />
            </div>

            {/* History */}
            <History />
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Bet Controls */}
            <BetControls
              onPlaceBet={placeBet}
              onCashout={cashout}
              onCancelBet={cancelBet}
            />

            {/* Active Bets */}
            <ActiveBets />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-game-panel border-t border-gray-700 mt-8">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          <p>🎮 Crash Game - Built with PixiJS & React</p>
          <p className="mt-1">Development Mode - Using Mock Data</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
