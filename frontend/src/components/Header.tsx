import React from 'react';
import { Settings, Wifi, WifiOff, Sparkles, SunMoon } from 'lucide-react';
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
        label: 'DEMO MODE',
        sublabel: 'Simulated Data',
        icon: <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-amber-950/90 border-2 border-amber-400 text-amber-300',
        dotClass: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      };
    }

    if (backendStatus === 'online') {
      return {
        label: 'SYSTEM ONLINE',
        sublabel: 'Backend Connected',
        icon: <Wifi className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border-2 border-[#00ff66] text-[#00ff66]'
          : 'bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300',
        dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      };
    }

    if (backendStatus === 'connecting') {
      return {
        label: 'CONNECTING...',
        sublabel: 'Reaching ML Server',
        icon: <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" aria-hidden="true" />,
        colorClass: isUltraContrast
          ? 'bg-black border-2 border-cyan-400 text-cyan-300'
          : 'bg-sky-950/90 border-2 border-sky-400 text-sky-300',
        dotClass: 'bg-cyan-400 shadow-[0_0_8px_#00ffff]',
      };
    }

    return {
      label: 'CONNECTION LOST',
      sublabel: 'Backend Offline',
      icon: <WifiOff className="w-5 h-5 text-red-400" aria-hidden="true" />,
      colorClass: isUltraContrast
        ? 'bg-black border-2 border-red-500 text-red-300'
        : 'bg-red-950/90 border-2 border-red-500 text-red-300',
      dotClass: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="w-full bg-[var(--bg-card)] border-b-3 border-[var(--border-subtle)] px-4 py-4 md:px-8 flex flex-wrap items-center justify-between gap-4 transition-colors">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3.5 h-3.5 bg-[var(--color-focus)] rounded-full" aria-hidden="true" />
          <p className="text-xs md:text-sm font-black tracking-widest text-[var(--color-focus)] uppercase">
            BLIND'S EYE
          </p>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">
          Spatial Navigation Assistant
        </h1>
      </div>

      {/* Accessibility Quick Toolbar (A-, A, A+ & High Contrast) + Settings */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Government Style Font Scaling Toolbar */}
        <div
          role="group"
          aria-label="Text Size Controls"
          className="flex items-center bg-[var(--bg-card-raised)] border-2 border-[var(--border-subtle)] rounded-xl p-1 gap-1"
        >
          <span className="text-xs font-black px-2 uppercase text-[var(--text-muted)] hidden sm:inline">
            Text:
          </span>
          <button
            onClick={() => onUpdateSettings({ textSize: 'normal' })}
            aria-pressed={settings.textSize === 'normal'}
            aria-label="Normal Text Size (A Minus)"
            title="Normal Text Size"
            className={`px-3 py-1.5 rounded-lg text-sm font-black border-2 transition-all cursor-pointer ${
              settings.textSize === 'normal'
                ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                : 'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-subtle)]'
            }`}
          >
            A-
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'large' })}
            aria-pressed={settings.textSize === 'large'}
            aria-label="Large Text Size (Default A)"
            title="Large Text Size"
            className={`px-3 py-1.5 rounded-lg text-base font-black border-2 transition-all cursor-pointer ${
              settings.textSize === 'large'
                ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                : 'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-subtle)]'
            }`}
          >
            A
          </button>
          <button
            onClick={() => onUpdateSettings({ textSize: 'extra-large' })}
            aria-pressed={settings.textSize === 'extra-large'}
            aria-label="Extra Large Text Size (A Plus)"
            title="Extra Large Text Size"
            className={`px-3 py-1.5 rounded-lg text-lg font-black border-2 transition-all cursor-pointer ${
              settings.textSize === 'extra-large'
                ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                : 'bg-transparent text-[var(--text-primary)] border-transparent hover:border-[var(--border-subtle)]'
            }`}
          >
            A+
          </button>
        </div>

        {/* 1-Click High Contrast Toggle (Yellow/Black) */}
        <button
          onClick={toggleContrast}
          aria-pressed={isUltraContrast}
          aria-label={isUltraContrast ? 'Switch to Standard Dark Contrast' : 'Switch to Ultra Yellow on Black High Contrast'}
          title="Toggle High Contrast (Yellow/Black)"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm border-2 transition-all cursor-pointer ${
            isUltraContrast
              ? 'bg-[#ffff00] text-black border-[#ffff00] shadow-[0_0_12px_#ffff00]'
              : 'bg-[var(--bg-card-raised)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--color-focus)]'
          }`}
        >
          <SunMoon className="w-4 h-4" aria-hidden="true" />
          <span className="font-extrabold">{isUltraContrast ? 'Yellow/Black ON' : 'High Contrast'}</span>
        </button>

        {/* Connection status badge */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-xs md:text-sm ${status.colorClass}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${status.dotClass}`} aria-hidden="true" />
          {status.icon}
          <div>
            <span className="block leading-none">{status.label}</span>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border-2 border-[var(--border-subtle)] rounded-xl font-bold text-sm md:text-base transition-colors active:scale-95 cursor-pointer"
          aria-label="Open Settings and Accessibility Controls (Shortcut: S)"
          title="Settings (Shortcut: S)"
        >
          <Settings className="w-5 h-5 text-[var(--color-focus)]" aria-hidden="true" />
          <span className="hidden sm:inline">Settings (S)</span>
        </button>
      </div>
    </header>
  );
};
