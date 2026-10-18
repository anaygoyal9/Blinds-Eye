import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Smartphone,
  Play,
  Square,
  Camera,
  EyeOff,
} from 'lucide-react';
import { ActiveAlert, AppSettings, BackendStatus, Direction } from '../../types/navigation';
import { apiService } from '../../services/api';

interface ObstacleDetectionScreenProps {
  activeAlert: ActiveAlert;
  isRunning: boolean;
  backendStatus: BackendStatus;
  settings: AppSettings;
  onToggleRunning: () => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onBack: () => void;
}

export const ObstacleDetectionScreen: React.FC<ObstacleDetectionScreenProps> = ({
  activeAlert,
  isRunning,
  backendStatus,
  settings,
  onToggleRunning,
  onUpdateSettings,
  onBack,
}) => {
  const [showStream, setShowStream] = useState(false);
  const activeDirection: Direction = isRunning ? activeAlert.direction : 'none';
  const isAlert = isRunning && activeAlert.isAlert;
  const isCritical = isRunning && activeAlert.status === 'CRITICAL';

  const videoFeedUrl = apiService.getVideoFeedUrl(settings.backendUrl);

  const primaryObstacle = activeAlert.primaryObstacle;
  const distanceFormatted = primaryObstacle
    ? (Math.max(0.5, (1000 - primaryObstacle.proximity) / 500)).toFixed(1) + ' metres'
    : '0.8 metres';

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Obstacle Detection
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[10px] font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendStatus === 'online' ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
            <span className="capitalize">{backendStatus}</span>
          </div>

          <button
            onClick={() => setShowStream(!showStream)}
            className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
            aria-label={showStream ? 'Hide camera companion feed' : 'Show camera companion feed'}
            title="Camera Stream"
          >
            <Camera className="w-5 h-5 text-[var(--color-focus)]" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Alert Banner (Wireframe Screen 5) */}
      <div
        className={`p-5 rounded-3xl border-2 flex items-center gap-4 mb-4 transition-all ${
          !isRunning
            ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
            : isCritical
            ? 'bg-[#3d0000] border-red-500 text-white animate-pulse shadow-xl'
            : isAlert
            ? 'bg-[#332200] border-yellow-400 text-yellow-200 shadow-lg'
            : 'bg-[#002b11] border-[#00e676] text-[#00ff66]'
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-black/40 border border-current">
          {isAlert ? (
            <AlertTriangle className="w-8 h-8 text-current stroke-[2.5]" aria-hidden="true" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-current stroke-[2.5]" aria-hidden="true" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-black leading-tight">
            {!isRunning
              ? 'Detection Standby'
              : isAlert
              ? `Obstacle Ahead`
              : 'Walking Path Clear'}
          </h2>
          <p className="text-xs sm:text-sm font-bold opacity-90 mt-0.5">
            {!isRunning
              ? 'Press Start Assistance below'
              : isAlert
              ? `${distanceFormatted} · ${isCritical ? 'HIGH RISK' : 'CAUTION'}`
              : 'Corridor unobstructed'}
          </p>
        </div>
      </div>

      {/* 3 Spatial Direction Cards (Left, Ahead, Right) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
        {/* Left */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center min-h-[110px] ${
            activeDirection === 'left' && isAlert
              ? 'bg-[#332200] border-yellow-400 text-yellow-300 font-black scale-105 shadow-md'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
          }`}
        >
          <ArrowLeft className="w-7 h-7 mb-1 stroke-[2.5]" aria-hidden="true" />
          <span className="text-xs font-black uppercase">Left</span>
          <span className="text-[11px] font-bold mt-1">
            {activeDirection === 'left' && isAlert ? 'Obstacle' : 'Clear'}
          </span>
        </div>

        {/* Ahead / Center */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center min-h-[110px] ${
            activeDirection === 'center' && isAlert
              ? isCritical
                ? 'bg-[#3d0000] border-red-500 text-white font-black scale-105 shadow-xl animate-pulse'
                : 'bg-[#332200] border-yellow-400 text-yellow-300 font-black scale-105 shadow-md'
              : isRunning
              ? 'bg-[#002b11] border-[#00e676] text-[#00ff66]'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
          }`}
        >
          <ArrowUp className="w-7 h-7 mb-1 stroke-[3]" aria-hidden="true" />
          <span className="text-xs font-black uppercase">Ahead</span>
          <span className="text-[11px] font-black mt-1">
            {activeDirection === 'center' && isAlert ? 'Obstacle' : isRunning ? 'Clear' : 'Ready'}
          </span>
        </div>

        {/* Right */}
        <div
          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center min-h-[110px] ${
            activeDirection === 'right' && isAlert
              ? 'bg-[#332200] border-yellow-400 text-yellow-300 font-black scale-105 shadow-md'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
          }`}
        >
          <ArrowRight className="w-7 h-7 mb-1 stroke-[2.5]" aria-hidden="true" />
          <span className="text-xs font-black uppercase">Right</span>
          <span className="text-[11px] font-bold mt-1">
            {activeDirection === 'right' && isAlert ? 'Obstacle' : 'Clear'}
          </span>
        </div>
      </div>

      {/* Live Alerts Settings Card */}
      <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl mb-4">
        <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">
          Alerts
        </h3>

        <div className="flex flex-col gap-2">
          {/* Voice Alert Toggle */}
          <div className="flex items-center justify-between py-1 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              {settings.voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" aria-hidden="true" />
              )}
              <span>Voice Alert</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                settings.voiceEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                  : 'bg-gray-800 text-gray-400 border border-gray-600'
              }`}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Vibration Alert Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Smartphone className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              <span>Vibration</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                settings.hapticEnabled
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400'
                  : 'bg-gray-800 text-gray-400 border border-gray-600'
              }`}
            >
              {settings.hapticEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Sighted Companion Video Stream Accordion (Optional) */}
      {showStream && (
        <div className="p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl mb-4 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase">
              Companion Stream (RGB + Depth)
            </span>
            <button
              onClick={() => setShowStream(false)}
              className="text-xs text-[var(--text-muted)] hover:text-white"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black aspect-[16/9] border border-[var(--border-subtle)]">
            <img
              src={videoFeedUrl}
              alt="Live video stream"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Primary Action Button (Start / Stop) */}
      <div className="mt-auto">
        <button
          onClick={onToggleRunning}
          className={`w-full py-4 px-6 rounded-2xl font-black text-lg sm:text-xl tracking-wide flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] shadow-xl cursor-pointer ${
            isRunning
              ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-white shadow-red-950/80'
              : 'bg-[#00e676] hover:bg-[#00ff66] text-black border-2 border-white shadow-emerald-950/80'
          }`}
          aria-label={isRunning ? 'Stop Obstacle Detection' : 'Start Obstacle Detection'}
        >
          {isRunning ? (
            <>
              <Square className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>STOP ASSISTANCE (Space)</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" aria-hidden="true" />
              <span>START ASSISTANCE (Space)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
