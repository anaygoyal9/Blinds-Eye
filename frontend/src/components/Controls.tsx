import React from 'react';
import { Play, Square, Volume2, VolumeX, Smartphone, Headphones, Sparkles, Navigation, Wrench } from 'lucide-react';
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
    <section aria-label="System Controls" className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Primary Action Button (Start/Stop) */}
      <button
        onClick={onToggleRunning}
        className={`w-full md:w-auto flex-1 py-3.5 px-6 rounded-2xl font-black text-lg md:text-xl tracking-wide flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] shadow-lg cursor-pointer ${
          isRunning
            ? 'bg-red-600 hover:bg-red-500 text-white border-3 border-white shadow-red-950/80'
            : 'bg-[#00e676] hover:bg-[#00ff66] text-black border-3 border-white shadow-emerald-950/80'
        }`}
        aria-label={
          isRunning
            ? 'Stop Navigation Assistance (Shortcut: Space)'
            : 'Start Navigation Assistance (Shortcut: Space)'
        }
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

      {/* Mode Selector & Quick Toggles Toolbar */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
        {/* Operating Modes */}
        <div className="flex items-center bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl p-1 gap-1">
          <button
            onClick={() => onSetAppMode('assistance')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black flex items-center gap-1 border transition-colors cursor-pointer ${
              appMode === 'assistance'
                ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)] font-black'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-primary)] hover:border-[var(--color-focus)]'
            }`}
            aria-pressed={appMode === 'assistance'}
          >
            <Navigation className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Live ML</span>
          </button>

          <button
            onClick={() => onSetAppMode('demo')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black flex items-center gap-1 border transition-colors cursor-pointer ${
              appMode === 'demo'
                ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-primary)] hover:border-yellow-400'
            }`}
            aria-pressed={appMode === 'demo'}
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Demo</span>
          </button>

          <button
            onClick={() => onSetAppMode('test')}
            className={`py-1.5 px-3 rounded-lg text-xs font-black flex items-center gap-1 border transition-colors cursor-pointer ${
              appMode === 'test'
                ? 'bg-purple-400 text-black border-purple-400 font-black'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-primary)] hover:border-purple-400'
            }`}
            aria-pressed={appMode === 'test'}
          >
            <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Test (T)</span>
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center bg-[var(--bg-card)] border-2 border-[var(--border-subtle)] rounded-xl p-1 gap-1">
          {/* Voice */}
          <button
            onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
            className={`p-1.5 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
              settings.voiceEnabled
                ? 'bg-[#00e676] text-black border-[#00e676]'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-muted)] opacity-60'
            }`}
            aria-pressed={settings.voiceEnabled}
            title="Toggle Voice Announcements (Shortcut: V)"
          >
            {settings.voiceEnabled ? (
              <Volume2 className="w-4 h-4 text-black" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Spatial Audio */}
          <button
            onClick={() =>
              onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
            }
            className={`p-1.5 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
              settings.spatialAudioEnabled
                ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-muted)] opacity-60'
            }`}
            aria-pressed={settings.spatialAudioEnabled}
            title="Toggle Spatial Audio Panning"
          >
            <Headphones className="w-4 h-4 text-black" aria-hidden="true" />
          </button>

          {/* Haptic */}
          <button
            onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
            className={`p-1.5 rounded-lg text-xs font-black border transition-colors cursor-pointer ${
              settings.hapticEnabled
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-[var(--bg-card-raised)] border-transparent text-[var(--text-muted)] opacity-60'
            }`}
            aria-pressed={settings.hapticEnabled}
            title="Toggle Haptic Feedback (Shortcut: H)"
          >
            <Smartphone className="w-4 h-4 text-black" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
