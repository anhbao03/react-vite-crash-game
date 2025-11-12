import { formatCurrency, formatMultiplier } from '@crash-game/utils';
import type { PlayerBet } from '@crash-game/websocket-client';
import { t } from '@/localization/localizationManager';

interface ActiveBetsProps {
  bets: PlayerBet[];
  currentMultiplier: number;
}

export function ActiveBets({ bets, currentMultiplier }: ActiveBetsProps) {
  const activeBets = bets.filter(bet => bet.status === 'active' || bet.status === 'cashed_out');

  return (
    <div className="card flex-1 flex flex-col max-h-80">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-white">{t('ACTIVE_BETS.TITLE')}</h2>
        <span className="text-sm text-dark-400">
          {t('ACTIVE_BETS.PLAYERS', { count: activeBets.length })}
        </span>
      </div>

      {activeBets.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-dark-400">
          <p className="text-sm">{t('ACTIVE_BETS.NO_BETS')}</p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto scrollbar-thin flex-1">
          {activeBets.map((bet) => (
            <div
              key={bet.id}
              className={`p-3 rounded-lg transition-colors ${
                bet.status === 'cashed_out'
                  ? 'bg-success-900/20 border border-success-500/30'
                  : 'bg-dark-700/50 border border-dark-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xs font-bold">
                    {bet.playerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {bet.playerName}
                  </span>
                </div>

                {bet.status === 'cashed_out' && (
                  <div className="flex items-center gap-1">
                    <span className="text-success-500 text-xs">✓</span>
                    <span className="text-success-500 text-sm font-bold">
                      {formatMultiplier(bet.cashoutMultiplier || 0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">
                  {t('ACTIVE_BETS.BET_LABEL')} {formatCurrency(bet.amount)}
                </span>

                {bet.status === 'active' ? (
                  <span className="text-primary-400 font-semibold">
                    {t('ACTIVE_BETS.AT_MULTIPLIER', { multiplier: formatMultiplier(currentMultiplier) })}
                  </span>
                ) : bet.status === 'cashed_out' && bet.profit ? (
                  <span className="text-success-500 font-semibold">
                    {t('NOTIFICATIONS.PROFIT', { amount: formatCurrency(bet.profit) })}
                  </span>
                ) : null}
              </div>

              {bet.autoCashout && bet.status === 'active' && (
                <div className="mt-1 text-xs text-dark-400">
                  {t('ACTIVE_BETS.AUTO_AT', { multiplier: formatMultiplier(bet.autoCashout) })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
