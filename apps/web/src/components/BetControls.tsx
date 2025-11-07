import { useState, useEffect } from 'react';
import { useGameStore } from '@crash-game/store';
import { validateBetAmount, validateAutoCashout, formatCurrency, formatMultiplier } from '@crash-game/utils';
import type { GameStatus } from '@crash-game/utils';

interface GameState {
  status: GameStatus;
  currentMultiplier: number;
}

interface Betting {
  currentBet: any;
  isPlacingBet: boolean;
  isCashingOut: boolean;
  betError: string | null;
  lastProfit: number | null;
  hasBet: boolean;
  placeBet: (amount: number, autoCashout?: number) => void;
  cashout: () => void;
  clearError: () => void;
  clearLastProfit: () => void;
}

interface BetControlsProps {
  gameState: GameState;
  betting: Betting;
  balance: number;
  disabled?: boolean;
}

export function BetControls({ gameState, betting, balance, disabled }: BetControlsProps) {
  const { settings, updateSettings } = useGameStore();
  const [betAmount, setBetAmount] = useState(settings.betAmount);
  const [autoCashout, setAutoCashout] = useState(settings.autoCashout);
  const [showAutoCashout, setShowAutoCashout] = useState(false);

  // Update store when values change
  useEffect(() => {
    updateSettings({ betAmount, autoCashout });
  }, [betAmount, autoCashout]);

  const handlePlaceBet = () => {
    const validation = validateBetAmount(betAmount);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (betAmount > balance) {
      alert('Insufficient balance');
      return;
    }

    betting.placeBet(betAmount, showAutoCashout ? autoCashout : undefined);
  };

  const handleCashout = () => {
    betting.cashout();
  };

  const quickBets = [10, 50, 100, 500];

  const canPlaceBet = gameState.status === 'betting' && !betting.hasBet;
  const canCashout = gameState.status === 'flying' && betting.hasBet;

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-white">Bet Controls</h2>

      {/* Bet Amount */}
      <div>
        <label className="block text-sm text-dark-300 mb-2">
          Bet Amount
        </label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="input w-full"
          min="1"
          max={balance}
          disabled={disabled || betting.hasBet}
        />

        {/* Quick Bet Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {quickBets.map((amount) => (
            <button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className="btn bg-dark-700 hover:bg-dark-600 text-white text-sm py-1"
              disabled={disabled || betting.hasBet}
            >
              {formatCurrency(amount)}
            </button>
          ))}
        </div>
      </div>

      {/* Auto Cashout */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-dark-300">
            Auto Cashout
          </label>
          <button
            onClick={() => setShowAutoCashout(!showAutoCashout)}
            className="text-xs text-primary-500 hover:text-primary-400"
            disabled={disabled || betting.hasBet}
          >
            {showAutoCashout ? 'Disable' : 'Enable'}
          </button>
        </div>
        
        {showAutoCashout && (
          <input
            type="number"
            value={autoCashout}
            onChange={(e) => setAutoCashout(Number(e.target.value))}
            className="input w-full"
            min="1.01"
            max="100"
            step="0.01"
            disabled={disabled || betting.hasBet}
          />
        )}
      </div>

      {/* Action Button */}
      <div>
        {canPlaceBet && (
          <button
            onClick={handlePlaceBet}
            disabled={disabled || betting.isPlacingBet}
            className="btn btn-success w-full py-3 text-lg font-bold"
          >
            {betting.isPlacingBet ? 'Placing Bet...' : `Place Bet ${formatCurrency(betAmount)}`}
          </button>
        )}

        {canCashout && (
          <button
            onClick={handleCashout}
            disabled={disabled || betting.isCashingOut}
            className="btn btn-primary w-full py-3 text-lg font-bold animate-pulse"
          >
            {betting.isCashingOut ? 'Cashing Out...' : `Cash Out at ${formatMultiplier(gameState.currentMultiplier)}`}
          </button>
        )}

        {!canPlaceBet && !canCashout && (
          <button
            disabled
            className="btn bg-dark-700 text-dark-400 w-full py-3 text-lg font-bold cursor-not-allowed"
          >
            {gameState.status === 'waiting' ? 'Waiting...' : 
             gameState.status === 'starting' ? 'Starting...' : 
             gameState.status === 'crashed' ? 'Round Ended' : 
             'Wait for next round'}
          </button>
        )}
      </div>

      {/* Current Bet Info */}
      {betting.currentBet && (
        <div className="card bg-dark-700 border-primary-500">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-dark-400">Your Bet:</span>
              <span className="text-white font-semibold">
                {formatCurrency(betting.currentBet.amount)}
              </span>
            </div>
            {betting.currentBet.autoCashout && (
              <div className="flex justify-between">
                <span className="text-dark-400">Auto Cashout:</span>
                <span className="text-primary-400 font-semibold">
                  {formatMultiplier(betting.currentBet.autoCashout)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Profit */}
      {betting.lastProfit !== null && (
        <div className="card bg-success-900/20 border-success-500">
          <div className="text-center">
            <div className="text-sm text-success-400 mb-1">Last Win</div>
            <div className="text-2xl font-bold text-success-500">
              +{formatCurrency(betting.lastProfit)}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {betting.betError && (
        <div className="card bg-danger-900/20 border-danger-500">
          <div className="flex items-center justify-between">
            <span className="text-sm text-danger-400">{betting.betError}</span>
            <button
              onClick={betting.clearError}
              className="text-xs text-dark-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
