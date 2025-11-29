import React from 'react';
import { useGameStore } from '../store/gameStore';

export const History: React.FC = () => {
  const { history } = useGameStore();

  const getMultiplierColor = (crashPoint: number): string => {
    if (crashPoint < 1.5) return 'bg-game-red text-white';
    if (crashPoint < 2) return 'bg-orange-500 text-white';
    if (crashPoint < 5) return 'bg-yellow-500 text-black';
    if (crashPoint < 10) return 'bg-game-green text-black';
    return 'bg-purple-500 text-white';
  };

  return (
    <div className="bg-game-panel rounded-lg p-4">
      <h3 className="text-lg font-bold text-white mb-3">
        📜 Round History
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center w-full py-4">
            No history yet
          </div>
        ) : (
          history.slice(0, 15).map((round, index) => (
            <div
              key={round.roundId}
              className={`px-3 py-1.5 rounded-full text-sm font-bold cursor-default
                transition hover:scale-110 ${getMultiplierColor(round.crashPoint)}
                ${index === 0 ? 'animate-pulse' : ''}
              `}
              title={`Round ${round.roundId} - ${new Date(round.timestamp).toLocaleTimeString()}`}
            >
              {round.crashPoint.toFixed(2)}x
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-gray-400 text-xs">Average</div>
            <div className="text-white font-bold">
              {(history.reduce((sum, r) => sum + r.crashPoint, 0) / history.length).toFixed(2)}x
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Highest</div>
            <div className="text-game-green font-bold">
              {Math.max(...history.map(r => r.crashPoint)).toFixed(2)}x
            </div>
          </div>
          <div>
            <div className="text-gray-400 text-xs">Lowest</div>
            <div className="text-game-red font-bold">
              {Math.min(...history.map(r => r.crashPoint)).toFixed(2)}x
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
