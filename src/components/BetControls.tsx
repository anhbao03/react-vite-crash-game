import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface BetControlsProps {
  onPlaceBet: () => void;
  onCashout: () => void;
  onCancelBet: () => void;
}

export const BetControls: React.FC<BetControlsProps> = ({
  onPlaceBet,
  onCashout,
  onCancelBet
}) => {
  const {
    phase,
    balance,
    currentBet,
    betAmount,
    autoCashoutAt,
    autoCashoutEnabled,
    multiplier,
    setBetAmount,
    setAutoCashout
  } = useGameStore();

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const canPlaceBet = phase === 'waiting' && !currentBet && betAmount <= balance;
  const canCashout = phase === 'running' && currentBet && !currentBet.cashedOut;
  const canCancel = phase === 'waiting' && currentBet;

  const currentProfit = currentBet && !currentBet.cashedOut
    ? (currentBet.amount * multiplier - currentBet.amount).toFixed(2)
    : '0.00';

  return (
    <div className="bg-game-panel rounded-lg p-4 space-y-4">
      {/* Balance Display */}
      <div className="flex justify-between items-center p-3 bg-game-accent rounded-lg">
        <span className="text-gray-400">Balance</span>
        <span className="text-xl font-bold text-game-gold">
          ${balance.toFixed(2)}
        </span>
      </div>

      {/* Bet Amount Input */}
      <div className="space-y-2">
        <label className="text-gray-400 text-sm">Bet Amount</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="flex-1 bg-game-accent text-white text-lg font-bold p-3 rounded-lg
                       border border-gray-600 focus:border-game-green focus:outline-none"
            min="1"
            max={balance}
            disabled={!!currentBet}
          />
          <button
            onClick={() => setBetAmount(betAmount * 2)}
            className="px-4 py-2 bg-game-accent text-white rounded-lg hover:bg-gray-600 transition"
            disabled={!!currentBet || betAmount * 2 > balance}
          >
            2x
          </button>
          <button
            onClick={() => setBetAmount(Math.floor(betAmount / 2))}
            className="px-4 py-2 bg-game-accent text-white rounded-lg hover:bg-gray-600 transition"
            disabled={!!currentBet}
          >
            ½
          </button>
        </div>
      </div>

      {/* Quick Bet Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => setBetAmount(amount)}
            className={`py-2 rounded-lg transition text-sm font-medium
              ${betAmount === amount
                ? 'bg-game-green text-black'
                : 'bg-game-accent text-white hover:bg-gray-600'
              }
              ${amount > balance ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!!currentBet || amount > balance}
          >
            ${amount}
          </button>
        ))}
      </div>

      {/* Auto Cashout */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-400 text-sm">Auto Cashout</label>
          <button
            onClick={() => setAutoCashout(!autoCashoutEnabled)}
            className={`w-12 h-6 rounded-full transition ${
              autoCashoutEnabled ? 'bg-game-green' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition transform ${
                autoCashoutEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {autoCashoutEnabled && (
          <input
            type="number"
            value={autoCashoutAt}
            onChange={(e) => setAutoCashout(true, Number(e.target.value))}
            className="w-full bg-game-accent text-white p-2 rounded-lg border border-gray-600
                       focus:border-game-green focus:outline-none"
            step="0.1"
            min="1.01"
          />
        )}
      </div>

      {/* Current Bet Info */}
      {currentBet && (
        <div className="bg-game-accent rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Your Bet</span>
            <span className="text-white font-bold">${currentBet.amount.toFixed(2)}</span>
          </div>
          {phase === 'running' && !currentBet.cashedOut && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Profit</span>
              <span className={`font-bold ${Number(currentProfit) >= 0 ? 'text-game-green' : 'text-game-red'}`}>
                +${currentProfit}
              </span>
            </div>
          )}
          {currentBet.cashedOut && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Cashed Out</span>
              <span className="text-game-green font-bold">
                @{currentBet.multiplier?.toFixed(2)}x (+${currentBet.profit?.toFixed(2)})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        {!currentBet ? (
          <button
            onClick={onPlaceBet}
            disabled={!canPlaceBet}
            className={`w-full py-4 rounded-lg font-bold text-lg transition
              ${canPlaceBet
                ? 'bg-game-green text-black hover:bg-green-400'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {phase === 'waiting' ? `BET $${betAmount.toFixed(2)}` : 'WAITING...'}
          </button>
        ) : canCashout ? (
          <button
            onClick={onCashout}
            className="w-full py-4 rounded-lg font-bold text-lg bg-game-gold text-black
                       hover:bg-yellow-400 transition animate-pulse"
          >
            CASHOUT ${(currentBet.amount * multiplier).toFixed(2)}
          </button>
        ) : canCancel ? (
          <button
            onClick={onCancelBet}
            className="w-full py-4 rounded-lg font-bold text-lg bg-game-red text-white
                       hover:bg-red-600 transition"
          >
            CANCEL BET
          </button>
        ) : (
          <button
            disabled
            className="w-full py-4 rounded-lg font-bold text-lg bg-gray-600 text-gray-400 cursor-not-allowed"
          >
            {currentBet.cashedOut ? 'BET COMPLETE' : 'WAITING...'}
          </button>
        )}
      </div>
    </div>
  );
};
