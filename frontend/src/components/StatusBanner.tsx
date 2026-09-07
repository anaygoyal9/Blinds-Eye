import React from 'react';
import { ShieldCheck, AlertTriangle, OctagonAlert, PauseCircle, WifiOff } from 'lucide-react';
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
        className="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-2xl text-[var(--text-secondary)] transition-colors"
      >
        <PauseCircle className="w-6 h-6 text-[var(--color-focus)] flex-shrink-0" aria-hidden="true" />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-black text-sm uppercase tracking-wider text-[var(--text-primary)]">
            STANDBY
          </span>
          <span className="text-xs text-[var(--text-muted)] font-semibold">
            · Press <strong className="text-[var(--color-focus)]">[START ASSISTANCE]</strong> or hit <kbd className="bg-black/60 px-1.5 py-0.5 rounded border border-[var(--border-subtle)] font-mono text-[11px]">Space</kbd>
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
              Cannot reach ML server. Run: <code className="bg-black px-2 py-0.5 rounded text-yellow-300 font-mono text-xs border border-yellow-400">python server.py</code>
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
        className="flex items-center gap-3 px-4 py-3 bg-[#3d0000] border-4 border-red-500 rounded-2xl text-white shadow-2xl animate-pulse"
      >
        <OctagonAlert className="w-8 h-8 text-white flex-shrink-0 stroke-[3]" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              CRITICAL STOP
            </span>
            <h2 className="text-lg md:text-xl font-black text-white">
              {activeAlert.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-red-100 font-bold mt-0.5">
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
        className="flex items-center gap-3 px-4 py-3 bg-[#332200] border-3 border-yellow-400 rounded-2xl text-yellow-100 shadow-lg"
      >
        <AlertTriangle className="w-7 h-7 text-yellow-400 flex-shrink-0 stroke-[3]" aria-hidden="true" />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              CAUTION
            </span>
            <h2 className="text-base md:text-lg font-black text-yellow-300">
              {activeAlert.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-white font-bold mt-0.5">
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
      className="flex items-center gap-3 px-4 py-3 bg-[#002b11] border-3 border-[#00e676] rounded-2xl text-[#00ff66] shadow-md"
    >
      <ShieldCheck className="w-7 h-7 text-[#00ff66] flex-shrink-0 stroke-[3]" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#00e676] text-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            ALL CLEAR
          </span>
          <h2 className="text-base md:text-lg font-black text-[#00ff66]">
            PATH CLEAR
          </h2>
        </div>
        <p className="text-xs text-emerald-100 font-semibold mt-0.5">
          Walking corridor is unobstructed. Safe to proceed.
        </p>
      </div>
    </div>
  );
};
