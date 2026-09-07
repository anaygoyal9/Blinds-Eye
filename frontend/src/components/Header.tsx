import React from 'react';
import { Settings, Wifi, WifiOff, Sparkles } from 'lucide-react';
import { AppMode, BackendStatus } from '../types/navigation';

interface HeaderProps {
  backendStatus: BackendStatus;
  appMode: AppMode;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  backendStatus,
  appMode,
  onOpenSettings,
}) => {
  const getStatusDisplay = () => {
    if (appMode === 'demo') {
      return {
        label: 'DEMO MODE',
        sublabel: 'Simulated Data',
        icon: <Sparkles className="w-5 h-5 text-amber-400" aria-hidden="true" />,
        colorClass: 'bg-amber-950/80 border-amber-400 text-amber-300',
        dotClass: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      };
    }

    if (backendStatus === 'online') {
      return {
        label: 'SYSTEM ONLINE',
        sublabel: 'Backend Connected',
        icon: <Wifi className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
        colorClass: 'bg-emerald-950/80 border-emerald-400 text-emerald-300',
        dotClass: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      };
    }

    if (backendStatus === 'connecting') {
      return {
        label: 'CONNECTING...',
        sublabel: 'Reaching ML Server',
        icon: <Wifi className="w-5 h-5 text-sky-400 animate-pulse" aria-hidden="true" />,
        colorClass: 'bg-sky-950/80 border-sky-400 text-sky-300',
        dotClass: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
      };
    }

    return {
      label: 'CONNECTION LOST',
      sublabel: 'Backend Offline',
      icon: <WifiOff className="w-5 h-5 text-red-400" aria-hidden="true" />,
      colorClass: 'bg-red-950/80 border-red-500 text-red-300',
      dotClass: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    };
  };

  const status = getStatusDisplay();

  return (
    <header className="w-full bg-[#080d14] border-b-2 border-[#243242] px-4 py-4 md:px-8 flex flex-wrap items-center justify-between gap-4">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 bg-cyan-400 rounded-full" aria-hidden="true" />
          <p className="text-xs md:text-sm font-bold tracking-widest text-cyan-400 uppercase">
            BLIND'S EYE
          </p>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          Spatial Navigation Assistant
        </h1>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-3">
        {/* Connection status badge (dual: icon + text + color) */}
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border-2 font-bold text-sm md:text-base ${status.colorClass}`}
        >
          <span className={`w-3 h-3 rounded-full ${status.dotClass}`} aria-hidden="true" />
          {status.icon}
          <div>
            <span className="block leading-none">{status.label}</span>
            <span className="text-[11px] font-normal opacity-80">{status.sublabel}</span>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-3 bg-[#182230] hover:bg-[#253549] text-white border-2 border-[#3b506b] rounded-xl font-bold text-base transition-colors active:scale-95 cursor-pointer"
          aria-label="Open Settings and Accessibility Controls (Shortcut: S)"
          title="Settings (Shortcut: S)"
        >
          <Settings className="w-5 h-5 text-cyan-400" aria-hidden="true" />
          <span className="hidden sm:inline">Settings (S)</span>
        </button>
      </div>
    </header>
  );
};
