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
    <section aria-label="System Controls" className="w-full flex flex-col gap-4">
      {/* Giant Primary Action Button */}
      <button
        onClick={onToggleRunning}
        className={`w-full py-5 md:py-6 px-8 rounded-2xl font-black text-xl md:text-2xl tracking-wide flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] shadow-2xl cursor-pointer ${
          isRunning
            ? 'bg-red-600 hover:bg-red-500 text-white border-4 border-red-300 shadow-red-950/80'
            : 'bg-emerald-500 hover:bg-emerald-400 text-black border-4 border-white shadow-emerald-950/80'
        }`}
        aria-label={isRunning ? 'Stop Navigation Assistance (Shortcut: Space)' : 'Start Navigation Assistance (Shortcut: Space)'}
      >
        {isRunning ? (
          <>
            <Square className="w-8 h-8 fill-current" aria-hidden="true" />
            <span>STOP ASSISTANCE (Space)</span>
          </>
        ) : (
          <>
            <Play className="w-8 h-8 fill-current" aria-hidden="true" />
            <span>START ASSISTANCE (Space)</span>
          </>
        )}
      </button>

      {/* Mode Selector & Quick Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operating Modes */}
        <div className="bg-[#0e141d] border-2 border-[#243242] rounded-2xl p-4 flex flex-col justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            OPERATING MODE
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onSetAppMode('assistance')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'assistance'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-300 hover:bg-[#1f2c3d]'
              }`}
              aria-pressed={appMode === 'assistance'}
            >
              <Navigation className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Live ML</span>
            </button>

            <button
              onClick={() => onSetAppMode('demo')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'demo'
                  ? 'bg-amber-950 border-amber-400 text-amber-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-300 hover:bg-[#1f2c3d]'
              }`}
              aria-pressed={appMode === 'demo'}
            >
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Demo</span>
            </button>

            <button
              onClick={() => onSetAppMode('test')}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                appMode === 'test'
                  ? 'bg-purple-950 border-purple-400 text-purple-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-300 hover:bg-[#1f2c3d]'
              }`}
              aria-pressed={appMode === 'test'}
            >
              <Wrench className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span>Test (T)</span>
            </button>
          </div>
        </div>

        {/* Quick Feedback Toggles */}
        <div className="bg-[#0e141d] border-2 border-[#243242] rounded-2xl p-4 flex flex-col justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-gray-400">
            FEEDBACK CHANNELS
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Voice Toggle */}
            <button
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.voiceEnabled
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-400 opacity-60'
              }`}
              aria-pressed={settings.voiceEnabled}
              title="Toggle Voice (Shortcut: V)"
            >
              {settings.voiceEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4" aria-hidden="true" />
              )}
              <span>Voice</span>
            </button>

            {/* Spatial Audio Toggle */}
            <button
              onClick={() =>
                onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
              }
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.spatialAudioEnabled
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-400 opacity-60'
              }`}
              aria-pressed={settings.spatialAudioEnabled}
            >
              <Headphones className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Spatial</span>
            </button>

            {/* Haptic Toggle */}
            <button
              onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
              className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 border-2 transition-colors cursor-pointer ${
                settings.hapticEnabled
                  ? 'bg-amber-950 border-amber-400 text-amber-300'
                  : 'bg-[#151e2a] border-[#253549] text-gray-400 opacity-60'
              }`}
              aria-pressed={settings.hapticEnabled}
              title="Toggle Haptics (Shortcut: H)"
            >
              <Smartphone className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Haptics</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
