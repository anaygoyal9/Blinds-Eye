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
        label: 'DEMO',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border border-yellow-400 text-yellow-300'
          : 'bg-amber-950/80 border border-amber-400 text-amber-300',
        dotClass: 'bg-amber-400',
      };
    }

    if (backendStatus === 'online') {
      return {
        label: 'ONLINE',
        icon: <Wifi className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border border-[#00ff66] text-[#00ff66]'
          : 'bg-emerald-950/80 border border-emerald-400 text-emerald-300',
        dotClass: 'bg-emerald-400',
      };
    }

    if (backendStatus === 'connecting') {
      return {
        label: 'CONNECTING',
        icon: <Wifi className="w-3.5 h-3.5 text-cyan-400 animate-pulse" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border border-cyan-400 text-cyan-300'
          : 'bg-sky-950/80 border border-sky-400 text-sky-300',
        dotClass: 'bg-cyan-400',
      };
    }

    return {
      label: 'OFFLINE',
      icon: <WifiOff className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />,
      colorClass: isUltraContrast
        ? 'bg-black border border-red-500 text-red-300'
        : 'bg-red-950/80 border border-red-500 text-red-300',
      dotClass: 'bg-red-500',
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="w-full bg-[var(--bg-card)] border-b-2 border-[var(--border-subtle)] px-3 py-2 md:px-6 flex items-center justify-between gap-3 transition-colors">
      {/* Brand - Compact Single Line */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="w-3 h-3 bg-[var(--color-focus)] rounded-full flex-shrink-0" aria-hidden="true" />
        <h1 className="text-base md:text-lg font-black tracking-tight text-[var(--text-primary)] whitespace-nowrap">
          BLIND'S EYE <span className="hidden sm:inline font-bold text-xs opacity-75 text-[var(--text-muted)]">| Spatial Navigation</span>
        </h1>
      </div>

      {/* Right Side Single-Row Accessibility & Control Toolbar */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-wrap justify-end">
        {/* Government Style Font Scaling Toolbar (A-, A, A+) */}
        <div
          role="group"
          aria-label="Text Size Controls"
          className="flex items-center bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] rounded-lg p-0.5"
        >
          <span className="text-[11px] font-black px-1.5 uppercase text-[var(--text-muted)] hidden md:inline">
            TEXT:
          </span>
          <button
            onClick={() => onUpdateSettings({ textSize: 'normal' })}
            aria-pressed={settings.textSize === 'normal'}
            aria-label="Normal Font Size"
            className={`px-2 py-0.5 rounded text-xs font-black transition-all cursor-pointer ${
              settings.textSize === 'normal'
                ? 'bg-[var(--color-focus)] text-black font-black'
                : 'bg-transparent text-[var(--text-primary)] hover:bg-white/10'
            }`}
          >
            A-
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'large' })}
            aria-pressed={settings.textSize === 'large'}
            aria-label="Large Font Size"
            className={`px-2 py-0.5 rounded text-xs font-black transition-all cursor-pointer ${
              settings.textSize === 'large'
                ? 'bg-[var(--color-focus)] text-black font-black'
                : 'bg-transparent text-[var(--text-primary)] hover:bg-white/10'
            }`}
          >
            A
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'extra-large' })}
            aria-pressed={settings.textSize === 'extra-large'}
            aria-label="Extra Large Font Size"
            className={`px-2 py-0.5 rounded text-xs font-black transition-all cursor-pointer ${
              settings.textSize === 'extra-large'
                ? 'bg-[var(--color-focus)] text-black font-black'
                : 'bg-transparent text-[var(--text-primary)] hover:bg-white/10'
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
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-black text-xs border transition-all cursor-pointer ${
            isUltraContrast
              ? 'bg-[#ffff00] text-black border-[#ffff00] shadow-[0_0_8px_#ffff00]'
              : 'bg-[var(--bg-card-raised)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--color-focus)]'
          }`}
        >
          <SunMoon className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{isUltraContrast ? 'Yellow/Black ON' : 'High Contrast'}</span>
        </button>

        {/* Backend Connection status badge */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black text-xs ${status.colorClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dotClass}`} aria-hidden="true" />
          {status.icon}
          <span>{status.label}</span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 px-2.5 py-1 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-lg font-bold text-xs transition-colors cursor-pointer"
          aria-label="Open Settings (Shortcut: S)"
          title="Settings (Shortcut: S)"
        >
          <Settings className="w-3.5 h-3.5 text-[var(--color-focus)]" aria-hidden="true" />
          <span>Settings (S)</span>
        </button>
      </div>
    </header>
  );
};
