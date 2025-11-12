import { formatCurrency } from '@crash-game/utils';
import { t } from '@/localization/localizationManager';
import { CURRENT_LANG } from '@/config/lang.config';

interface HeaderProps {
  balance: number;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export function Header({ balance, isConnected, connectionStatus }: HeaderProps) {
  const getConnectionText = () => {
    if (isConnected) return t('CONNECTION.CONNECTED');
    if (connectionStatus === 'connecting') return t('CONNECTION.CONNECTING');
    return t('CONNECTION.DISCONNECTED');
  };

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('APP.TITLE')}</h1>
            <p className="text-xs text-dark-400">{t('APP.SUBTITLE')}</p>
          </div>
        </div>

        {/* Center - Connection Status & Language */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-success-500 animate-pulse' : 
              connectionStatus === 'connecting' ? 'bg-warning-500 animate-pulse' :
              'bg-danger-500'
            }`} />
            <span className="text-sm text-dark-300">
              {getConnectionText()}
            </span>
          </div>
          
          {/* Language indicator */}
          <div className="text-sm text-dark-400 flex items-center gap-1">
            <span>{CURRENT_LANG.flag}</span>
            <span>{CURRENT_LANG.nativeName}</span>
          </div>
        </div>

        {/* Right - Balance */}
        <div className="flex items-center gap-4">
          <div className="card px-6 py-2">
            <div className="text-xs text-dark-400 mb-1">{t('BALANCE.TITLE')}</div>
            <div className="text-lg font-bold text-success-500">
              {formatCurrency(balance)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
