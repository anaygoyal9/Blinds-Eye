import React from 'react';
import { Play, Square, Volume2, VolumeX, Smartphone, Headphones, Sparkles, Activity, Wrench } from 'lucide-react';
import { AppMode, AppSettings } from '../types/navigation';

interface ControlsProps {
  isRunning: boolean;
  appMode: AppMode;
  settings: AppSettings;
  onToggleRunning: () => void;
  onSetAppMode: (mode: AppMode) => void;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  appMode,
  settings,
  onToggleRunning,
  onSetAppMode,
  onUpdateSettings,
}) => {
  return (
    <section aria-label="System Controls" className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
      {/* Primary Action Button (Start/Stop) */}
      <button
        onClick={onToggleRunning}
        className={`w-full md:w-auto flex-1 min-h-[46px] sm:min-h-[50px] py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg md:text-xl tracking-wide flex items-center justify-center gap-2 sm:gap-3 transition-all duration-150 active:scale-[0.98] shadow-lg cursor-pointer ${
          isRunning
            ? 'bg-red-600 hover:bg-red-500 text-white border-2 border-white shadow-red-950/80'
            : 'bg-[#00e676] hover:bg-[#00ff66] text-black border-2 border-white shadow-emerald-950/80'
        }`}
        aria-label={
          isRunning
            ? 'Stop Navigation Assistance (Shortcut: Space)'
            : 'Start Navigation Assistance (Shortcut: Space)'
        }
      >
        {isRunning ? (
          <>
            <Square className="w-5 h-5 sm:w-6 sm:h-6 fill-current flex-shrink-0" aria-hidden="true" />
            <span>STOP ASSISTANCE (Space)</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current flex-shrink-0" aria-hidden="true" />
            <span>START ASSISTANCE (Space)</span>
          </>
        )}
      </button>

      {/* Unified Secondary Toolbar: Modes + Quick Toggles */}
      <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-1 gap-1 w-full md:w-auto justify-between md:justify-end">
        {/* Operating Modes */}
        <div role="group" aria-label="Operating Modes" className="flex items-center gap-1">
          <button
            onClick={() => onSetAppMode('assistance')}
            className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              appMode === 'assistance'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={appMode === 'assistance'}
          >
            <Activity className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Live ML</span>
          </button>

          <button
            onClick={() => onSetAppMode('demo')}
            className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              appMode === 'demo'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={appMode === 'demo'}
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Demo</span>
          </button>

          <button
            onClick={() => onSetAppMode('test')}
            className={`h-8 px-2.5 sm:px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              appMode === 'test'
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={appMode === 'test'}
          >
            <Wrench className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>Test (T)</span>
          </button>
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-5 w-px bg-[var(--border-subtle)] mx-0.5" aria-hidden="true" />

        {/* Quick Toggles */}
        <div role="group" aria-label="Sensory Feedback Toggles" className="flex items-center gap-1">
          {/* Voice */}
          <button
            onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              settings.voiceEnabled
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={settings.voiceEnabled}
            title="Toggle Voice Announcements (Shortcut: V)"
            aria-label="Toggle Voice Announcements (Shortcut: V)"
          >
            {settings.voiceEnabled ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Spatial Audio */}
          <button
            onClick={() =>
              onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
            }
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              settings.spatialAudioEnabled
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={settings.spatialAudioEnabled}
            title="Toggle Spatial Audio Panning"
            aria-label="Toggle Spatial Audio Panning"
          >
            <Headphones className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Haptic */}
          <button
            onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              settings.hapticEnabled
                ? 'bg-[var(--color-focus)] text-black font-black shadow-sm'
                : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-raised)] hover:text-[var(--text-primary)]'
            }`}
            aria-pressed={settings.hapticEnabled}
            title="Toggle Haptic Feedback (Shortcut: H)"
            aria-label="Toggle Haptic Feedback (Shortcut: H)"
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
