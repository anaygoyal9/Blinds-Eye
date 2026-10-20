import React from 'react';
import { ShieldCheck, AlertTriangle, OctagonAlert, WifiOff } from 'lucide-react';
import { ActiveAlert, BackendStatus } from '../types/navigation';

interface StatusBannerProps {
  activeAlert: ActiveAlert;
  isRunning: boolean;
  backendStatus: BackendStatus;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  activeAlert,
  isRunning,
  backendStatus,
}) => {
  // If not running, show a compact short Standby box
  if (!isRunning) {
    return (
      <div
        role="status"
        aria-label="Navigation Status Standby"
        className="flex items-center gap-2.5 sm:gap-3 px-3.5 py-2 sm:py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl sm:rounded-2xl text-[var(--text-secondary)] transition-colors"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gray-500 flex-shrink-0" aria-hidden="true" />
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="font-bold text-xs sm:text-sm text-[var(--text-muted)] tracking-wide">
            Standby
          </span>
          <span className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-medium">
            — Press Start Assistance or hit <kbd className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] font-mono text-[10px] sm:text-[11px]">Space</kbd>
          </span>
        </div>
      </div>
    );
  }

  // Backend offline warning
  if (backendStatus === 'offline') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex items-center gap-3 px-4 py-3 bg-red-950 border-3 border-red-500 rounded-2xl text-red-100 shadow-xl"
      >
        <WifiOff className="w-6 h-6 text-white flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <span className="font-black text-sm uppercase tracking-wider text-red-300 mr-2">
              SERVER OFFLINE
            </span>
            <span className="text-xs font-bold text-white">
              Cannot reach ML server. Run: <code className="bg-[var(--bg-card-raised)] px-2 py-0.5 rounded text-[var(--color-warning)] font-mono text-xs border border-yellow-400">python server.py</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active Alert: Critical Stop
  if (activeAlert.status === 'CRITICAL') {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex items-center gap-3 px-4 py-3 bg-[var(--color-alert-bg)] border-4 border-[var(--color-alert-border)] rounded-2xl text-[var(--color-alert)] shadow-2xl animate-pulse"
      >
        <OctagonAlert className="w-8 h-8 text-[var(--color-alert)] flex-shrink-0 stroke-[3]" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[var(--color-alert)] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              CRITICAL STOP
            </span>
            <h2 className="text-lg md:text-xl font-black text-[var(--color-alert)]">
              {activeAlert.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[var(--text-primary)] font-bold mt-0.5">
            {activeAlert.detail}
          </p>
        </div>
      </div>
    );
  }

  // Active Alert: Caution
  if (activeAlert.status === 'ALERT') {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="flex items-center gap-3 px-4 py-3 bg-[var(--color-warning-bg)] border-3 border-[var(--color-warning-border)] rounded-2xl text-[var(--color-warning)] shadow-lg"
      >
        <AlertTriangle className="w-7 h-7 text-[var(--color-warning)] flex-shrink-0 stroke-[3]" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[var(--color-warning)] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              CAUTION
            </span>
            <h2 className="text-base md:text-lg font-black text-[var(--color-warning)]">
              {activeAlert.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[var(--text-primary)] font-bold mt-0.5">
            {activeAlert.detail}
          </p>
        </div>
      </div>
    );
  }

  // Path Clear
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 px-4 py-3 bg-[var(--color-clear-bg)] border-3 border-[var(--color-clear-border)] rounded-2xl text-[var(--color-clear)] shadow-md"
    >
      <ShieldCheck className="w-7 h-7 text-[#00ff66] flex-shrink-0 stroke-[3]" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[var(--color-clear)] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            ALL CLEAR
          </span>
          <h2 className="text-base md:text-lg font-black text-[var(--color-clear)]">
            PATH CLEAR
          </h2>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-semibold mt-0.5">
          Walking corridor is unobstructed. Safe to proceed.
        </p>
      </div>
    </div>
  );
};
