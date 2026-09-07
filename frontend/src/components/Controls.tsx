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
    <section aria-label="System Controls" className="w-full flex flex-col gap-5">
      {/* Giant Primary Action Button */}
      <button
        onClick={onToggleRunning}
        className={`w-full py-6 px-8 rounded-3xl font-black text-2xl md:text-3xl tracking-wide flex items-center justify-center gap-4 transition-all duration-150 active:scale-[0.98] shadow-2xl cursor-pointer ${
          isRunning
            ? 'bg-red-600 hover:bg-red-500 text-white border-4 border-white shadow-red-950/80'
            : 'bg-[#00e676] hover:bg-[#00ff66] text-black border-4 border-white shadow-emerald-950/80'
        }`}
        aria-label={
          isRunning
            ? 'Stop Navigation Assistance (Shortcut: Space)'
            : 'Start Navigation Assistance (Shortcut: Space)'
        }
      >
        {isRunning ? (
          <>
            <Square className="w-9 h-9 fill-current" aria-hidden="true" />
            <span>STOP ASSISTANCE (Space)</span>
          </>
        ) : (
          <>
            <Play className="w-9 h-9 fill-current" aria-hidden="true" />
            <span>START ASSISTANCE (Space)</span>
          </>
        )}
      </button>

      {/* Mode Selector & Quick Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operating Modes */}
        <div className="bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
            OPERATING MODE
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSetAppMode('assistance')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'assistance'
                  ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)] font-black'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--color-focus)]'
              }`}
              aria-pressed={appMode === 'assistance'}
            >
              <Navigation className="w-4 h-4" aria-hidden="true" />
              <span>Live ML</span>
            </button>

            <button
              onClick={() => onSetAppMode('demo')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'demo'
                  ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-yellow-400'
              }`}
              aria-pressed={appMode === 'demo'}
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Demo</span>
            </button>

            <button
              onClick={() => onSetAppMode('test')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'test'
                  ? 'bg-purple-400 text-black border-purple-400 font-black'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-purple-400'
              }`}
              aria-pressed={appMode === 'test'}
            >
              <Wrench className="w-4 h-4" aria-hidden="true" />
              <span>Test (T)</span>
            </button>
          </div>
        </div>

        {/* Quick Feedback Toggles */}
        <div className="bg-[var(--bg-card)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col justify-between gap-3 transition-colors">
          <span className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
            FEEDBACK CHANNELS
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Voice Toggle */}
            <button
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.voiceEnabled
                  ? 'bg-[#00e676] text-black border-[#00e676]'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
              }`}
              aria-pressed={settings.voiceEnabled}
              title="Toggle Voice (Shortcut: V)"
            >
              {settings.voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-black" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              )}
              <span>Voice (V)</span>
            </button>

            {/* Spatial Audio Toggle */}
            <button
              onClick={() =>
                onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
              }
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.spatialAudioEnabled
                  ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
              }`}
              aria-pressed={settings.spatialAudioEnabled}
            >
              <Headphones className="w-4 h-4 text-black" aria-hidden="true" />
              <span>Spatial</span>
            </button>

            {/* Haptic Toggle */}
            <button
              onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.hapticEnabled
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-[var(--bg-card-raised)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
              }`}
              aria-pressed={settings.hapticEnabled}
              title="Toggle Haptics (Shortcut: H)"
            >
              <Smartphone className="w-4 h-4 text-black" aria-hidden="true" />
              <span>Haptics (H)</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
