import React from 'react';
import { Settings, Sparkles, SunMoon, Wifi, WifiOff } from 'lucide-react';
import { AppMode, AppSettings, BackendStatus, ContrastTheme } from '../types/navigation';

interface HeaderProps {
  backendStatus: BackendStatus;
  appMode: AppMode;
  settings: AppSettings;
  onOpenSettings: () => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  backendStatus,
  appMode,
  settings,
  onOpenSettings,
  onUpdateSettings,
}) => {
  const isUltraContrast = settings.contrastTheme === 'ultra-high-contrast';

  const toggleContrast = () => {
    const nextTheme: ContrastTheme = isUltraContrast ? 'standard-dark' : 'ultra-high-contrast';
    onUpdateSettings({ contrastTheme: nextTheme });
  };

  const getStatusDisplay = () => {
    if (appMode === 'demo') {
      return {
        label: 'Demo Mode',
        icon: <Sparkles className="w-3 h-3 text-amber-400" aria-hidden="true" />,
        dotClass: 'bg-amber-400',
        textClass: 'text-amber-300',
      };
    }

    if (backendStatus === 'online') {
      return {
        label: 'Online',
        icon: <Wifi className="w-3 h-3 text-emerald-400" aria-hidden="true" />,
        dotClass: 'bg-emerald-400',
        textClass: 'text-emerald-300',
      };
    }

    if (backendStatus === 'connecting') {
      return {
        label: 'Connecting...',
        icon: <Wifi className="w-3 h-3 text-cyan-400 animate-pulse" aria-hidden="true" />,
        dotClass: 'bg-cyan-400 animate-pulse',
        textClass: 'text-cyan-300',
      };
    }

    return {
      label: 'Offline',
      icon: <WifiOff className="w-3 h-3 text-red-400/80" aria-hidden="true" />,
      dotClass: 'bg-red-400/80',
      textClass: 'text-[var(--text-muted)]',
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="w-full bg-[var(--bg-card)] border-b-2 border-[var(--border-subtle)] px-2.5 py-2 sm:px-4 md:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 transition-colors">
      {/* Brand & Connection Badge Row on Mobile */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--color-focus)] rounded-full flex-shrink-0" aria-hidden="true" />
          <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            BLIND'S EYE <span className="hidden sm:inline font-bold text-xs opacity-75 text-[var(--text-muted)]">| Spatial Navigation</span>
          </h1>
        </div>

        {/* Backend Connection status badge (shown here on small mobile, hidden on sm+ so it stays right) */}
        <div
          role="status"
          aria-live="polite"
          className="sm:hidden flex items-center gap-1.5 px-2 py-1 text-xs font-semibold"
        >
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} aria-hidden="true" />
          <span className={status.textClass}>{status.label}</span>
        </div>
      </div>

      {/* Right Side Accessibility & Control Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2 justify-between sm:justify-end flex-wrap sm:flex-nowrap">
        {/* Government Style Font Scaling Toolbar (A-, A, A+) */}
        <div
          role="group"
          aria-label="Text Size Controls"
          className="flex items-center bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] rounded-lg p-0.5"
        >
          <span className="text-[11px] font-bold px-1.5 uppercase text-[var(--text-muted)] hidden md:inline">
            Text:
          </span>
          <button
            onClick={() => onUpdateSettings({ textSize: 'normal' })}
            aria-pressed={settings.textSize === 'normal'}
            aria-label="Normal Font Size"
            className={`min-w-[32px] sm:min-w-[34px] h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              settings.textSize === 'normal'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
            }`}
          >
            A-
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'large' })}
            aria-pressed={settings.textSize === 'large'}
            aria-label="Large Font Size"
            className={`min-w-[32px] sm:min-w-[34px] h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              settings.textSize === 'large'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
            }`}
          >
            A
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'extra-large' })}
            aria-pressed={settings.textSize === 'extra-large'}
            aria-label="Extra Large Font Size"
            className={`min-w-[32px] sm:min-w-[34px] h-8 flex items-center justify-center rounded-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              settings.textSize === 'extra-large'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]'
            }`}
          >
            A+
          </button>
        </div>

        {/* 1-Click High Contrast Toggle (Yellow/Black) */}
        <button
          onClick={toggleContrast}
          aria-pressed={isUltraContrast}
          aria-label={isUltraContrast ? 'Switch to Standard Dark' : 'Switch to Ultra Yellow/Black Contrast'}
          title="Toggle High Contrast (Yellow/Black)"
          className={`flex items-center justify-center gap-1.5 px-3 h-8 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
            isUltraContrast
              ? 'bg-[#ffff00] text-black border-[#ffff00] font-black shadow-sm'
              : 'bg-[var(--bg-card-raised)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--color-focus)]'
          }`}
        >
          <SunMoon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">{isUltraContrast ? 'Yellow/Black' : 'Contrast'}</span>
        </button>

        {/* Backend Connection status indicator on sm+ (Non-button label with status dot) */}
        <div
          role="status"
          aria-live="polite"
          className="hidden sm:flex items-center gap-1.5 px-2 h-8 text-xs font-semibold"
        >
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} aria-hidden="true" />
          <span className={status.textClass}>{status.label}</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center gap-1.5 px-3 h-8 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg font-bold text-xs transition-colors cursor-pointer"
          aria-label="Open Settings (Shortcut: S)"
          title="Settings (Shortcut: S)"
        >
          <Settings className="w-3.5 h-3.5 text-[var(--color-focus)] flex-shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Settings (S)</span>
        </button>
      </div>
    </header>
  );
};
