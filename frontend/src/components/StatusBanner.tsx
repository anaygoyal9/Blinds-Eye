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
        className="w-full bg-[#0e141d] border-3 border-[#243242] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#182230] border-2 border-[#3b506b] flex items-center justify-center flex-shrink-0 text-cyan-400">
            <PauseCircle className="w-10 h-10" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
              CURRENT STATUS
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              STANDBY
            </h2>
            <p className="text-lg text-gray-300 mt-1">
              Press <strong className="text-cyan-400">[Start Assistance]</strong> or hit <kbd className="bg-gray-800 px-2 py-0.5 rounded border border-gray-600 font-mono text-sm">Space</kbd> to begin.
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
        className="w-full bg-red-950/90 border-4 border-red-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left shadow-lg shadow-red-950/50"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-900 border-2 border-red-400 flex items-center justify-center flex-shrink-0 text-white">
          <WifiOff className="w-10 h-10" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-widest font-black text-red-300">
            SYSTEM ALERT
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            BACKEND SERVER OFFLINE
          </h2>
          <p className="text-lg md:text-xl text-red-100 font-semibold mt-1">
            Cannot reach ML Server on configured URL. Run: <code className="bg-black/60 px-2 py-1 rounded text-red-200 font-mono">python server.py</code>
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
        className="w-full bg-[#3a0808] border-4 border-red-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left animate-pulse"
      >
        <div className="w-20 h-20 rounded-2xl bg-red-600 border-2 border-white flex items-center justify-center flex-shrink-0 text-white shadow-xl">
          <OctagonAlert className="w-12 h-12 stroke-[2.5]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
            CRITICAL COLLISION WARNING
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {activeAlert.title}
          </h2>
          <p className="text-xl md:text-2xl text-red-100 font-bold mt-2">
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
        className="w-full bg-[#331800] border-4 border-amber-400 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
      >
        <div className="w-18 h-18 rounded-2xl bg-amber-500 border-2 border-white flex items-center justify-center flex-shrink-0 text-black shadow-lg">
          <AlertTriangle className="w-11 h-11 stroke-[2.5]" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <div className="inline-block bg-amber-400 text-black px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
            OBSTACLE CAUTION
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-200 tracking-tight">
            {activeAlert.title}
          </h2>
          <p className="text-lg md:text-xl text-white font-semibold mt-1">
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
      className="w-full bg-[#022413] border-4 border-emerald-500 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
    >
      <div className="w-18 h-18 rounded-2xl bg-emerald-500 border-2 border-white flex items-center justify-center flex-shrink-0 text-black shadow-lg">
        <ShieldCheck className="w-11 h-11 stroke-[2.5]" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <div className="inline-block bg-emerald-500 text-black px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase mb-1">
          SYSTEM STATUS: ALL CLEAR
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-emerald-300 tracking-tight">
          PATH CLEAR
        </h2>
        <p className="text-lg md:text-xl text-emerald-100 font-semibold mt-1">
          No immediate obstacles detected in walking corridor. Safe to proceed.
        </p>
      </div>
    </section>
  );
};
