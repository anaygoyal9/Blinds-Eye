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
  // If not running, show Standby
  if (!isRunning) {
    return (
      <section
        aria-label="Navigation System Status"
        className="w-full bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left transition-colors"
      >
        <div className="flex items-center gap-5">
          <div className="w-18 h-18 rounded-2xl bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 text-[var(--color-focus)]">
            <PauseCircle className="w-12 h-12" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-black text-[var(--text-muted)]">
              CURRENT SYSTEM STATUS
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)]">
              STANDBY
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-secondary)] font-semibold mt-1">
              Press <strong className="text-[var(--color-focus)] underline">[START ASSISTANCE]</strong> or hit <kbd className="bg-[var(--bg-card-raised)] px-2 py-0.5 rounded border border-[var(--border-subtle)] font-mono text-sm">Space</kbd> to begin.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Backend offline warning
  if (backendStatus === 'offline') {
    return (
      <section
        role="alert"
        aria-live="assertive"
        aria-label="Critical System Alert"
        className="w-full bg-red-950 border-4 border-red-500 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left shadow-2xl"
      >
        <div className="w-18 h-18 rounded-2xl bg-red-900 border-3 border-white flex items-center justify-center flex-shrink-0 text-white">
          <WifiOff className="w-12 h-12" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest font-black text-red-300">
            SYSTEM ALERT
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white">
            BACKEND SERVER OFFLINE
          </h2>
          <p className="text-lg md:text-xl text-red-100 font-bold mt-1">
            Cannot reach ML Server. Start local backend with: <code className="bg-black px-2.5 py-1 rounded text-yellow-300 font-mono text-base border border-yellow-400">python server.py</code>
          </p>
        </div>
      </section>
    );
  }

  // Active Alert: Critical vs Alert vs Clear
  if (activeAlert.status === 'CRITICAL') {
    return (
      <section
        role="alert"
        aria-live="assertive"
        aria-label="Critical Obstacle Stop Alert"
        className="w-full bg-[#3d0000] border-4 border-red-500 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left animate-pulse"
      >
        <div className="w-20 h-20 rounded-2xl bg-red-600 border-3 border-white flex items-center justify-center flex-shrink-0 text-white shadow-2xl">
          <OctagonAlert className="w-14 h-14 stroke-[3]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
            CRITICAL COLLISION WARNING
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {activeAlert.title}
          </h2>
          <p className="text-xl md:text-2xl text-red-100 font-black mt-2">
            {activeAlert.detail}
          </p>
        </div>
      </section>
    );
  }

  if (activeAlert.status === 'ALERT') {
    return (
      <section
        role="alert"
        aria-live="polite"
        aria-label="Obstacle Warning"
        className="w-full bg-[#332200] border-4 border-yellow-400 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
      >
        <div className="w-20 h-20 rounded-2xl bg-yellow-400 border-3 border-black flex items-center justify-center flex-shrink-0 text-black shadow-xl">
          <AlertTriangle className="w-14 h-14 stroke-[3]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
            OBSTACLE CAUTION
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-yellow-300 tracking-tight">
            {activeAlert.title}
          </h2>
          <p className="text-xl md:text-2xl text-white font-black mt-1">
            {activeAlert.detail}
          </p>
        </div>
      </section>
    );
  }

  // Clear path
  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="Path Clear Status"
      className="w-full bg-[#002b11] border-4 border-[#00e676] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
    >
      <div className="w-20 h-20 rounded-2xl bg-[#00e676] border-3 border-white flex items-center justify-center flex-shrink-0 text-black shadow-xl">
        <ShieldCheck className="w-14 h-14 stroke-[3]" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="inline-block bg-[#00e676] text-black px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
          SYSTEM STATUS: ALL CLEAR
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[#00ff66] tracking-tight">
          PATH CLEAR
        </h2>
        <p className="text-xl md:text-2xl text-emerald-100 font-bold mt-1">
          No immediate obstacles detected in walking corridor. Safe to proceed.
        </p>
      </div>
    </section>
  );
};
