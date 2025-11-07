import { useState, useEffect } from 'react';
import { formatMultiplier } from '@crash-game/utils';
import type { HistoryRound } from '@crash-game/websocket-client';

export function History() {
  const [history, setHistory] = useState<HistoryRound[]>([]);

  // Mock history for demo (replace with real data from WebSocket)
  useEffect(() => {
    // Generate some mock history
    const mockHistory: HistoryRound[] = Array.from({ length: 10 }, (_, i) => ({
      roundId: `round-${i}`,
      roundNumber: 1000 + i,
      crashPoint: Math.random() * 10 + 1,
      startTime: Date.now() - (i * 60000),
      endTime: Date.now() - (i * 60000) + 30000,
      totalBets: Math.floor(Math.random() * 50) + 10,
      totalWagered: Math.floor(Math.random() * 10000) + 1000,
    }));
    
    setHistory(mockHistory);
  }, []);

  const getMultiplierColorClass = (multiplier: number) => {
    if (multiplier < 2) return 'bg-success-500';
    if (multiplier < 5) return 'bg-primary-500';
    if (multiplier < 10) return 'bg-secondary-500';
    return 'bg-danger-500';
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">Round History</h2>
        <span className="text-sm text-dark-400">Last {history.length} rounds</span>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        {history.map((round) => (
          <div
            key={round.roundId}
            className="flex-shrink-0 group cursor-pointer"
            title={`Round #${round.roundNumber}: ${formatMultiplier(round.crashPoint)}`}
          >
            <div
              className={`
                w-14 h-14 rounded-lg
                ${getMultiplierColorClass(round.crashPoint)}
                flex items-center justify-center
                font-bold text-white
                transition-transform hover:scale-110
                relative
              `}
            >
              <span className="text-sm">
                {round.crashPoint.toFixed(2)}x
              </span>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                            opacity-0 group-hover:opacity-100 transition-opacity
                            bg-dark-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap
                            pointer-events-none z-10">
                <div className="font-semibold">Round #{round.roundNumber}</div>
                <div className="text-dark-300">{round.totalBets} players</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                              border-4 border-transparent border-t-dark-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
