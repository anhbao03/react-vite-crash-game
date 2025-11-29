import React from 'react';
import { useGameStore } from '../store/gameStore';

export const ActiveBets: React.FC = () => {
  const { bets, phase, multiplier } = useGameStore();

  // Sort bets: player's bet first, then by amount
  const sortedBets = [...bets].sort((a, b) => {
    if (a.oddesplayerId === 'player_1') return -1;
    if (b.oddesplayerId === 'player_1') return 1;
    return b.amount - a.amount;
  });

  return (
    <div className="bg-game-panel rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-game-green animate-pulse"></span>
        Active Bets ({bets.length})
      </h3>
      
      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
        {sortedBets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No active bets
          </div>
        ) : (
          sortedBets.map((bet) => {
            const isPlayer = bet.oddesplayerId === 'player_1';
            const currentValue = bet.cashedOut
              ? bet.amount * (bet.multiplier || 1)
              : bet.amount * multiplier;
            const profit = currentValue - bet.amount;

            return (
              <div
                key={bet.id}
                className={`flex items-center justify-between p-3 rounded-lg transition
                  ${isPlayer ? 'bg-game-green/20 border border-game-green/50' : 'bg-game-accent'}
                  ${bet.cashedOut ? 'opacity-75' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isPlayer ? 'bg-game-green text-black' : 'bg-gray-600 text-white'}
                  `}>
                    {bet.playerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={`font-medium ${isPlayer ? 'text-game-green' : 'text-white'}`}>
                      {isPlayer ? 'You' : bet.playerName}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${bet.amount.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {bet.cashedOut ? (
                    <>
                      <div className="text-game-green font-bold">
                        {bet.multiplier?.toFixed(2)}x
                      </div>
                      <div className="text-sm text-game-green">
                        +${bet.profit?.toFixed(2)}
                      </div>
                    </>
                  ) : phase === 'running' ? (
                    <>
                      <div className="text-white font-bold">
                        ${currentValue.toFixed(2)}
                      </div>
                      <div className={`text-sm ${profit >= 0 ? 'text-game-green' : 'text-game-red'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toFixed(2)}
                      </div>
                    </>
                  ) : phase === 'crashed' ? (
                    <div className="text-game-red font-bold">
                      -${bet.amount.toFixed(2)}
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      Waiting...
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
