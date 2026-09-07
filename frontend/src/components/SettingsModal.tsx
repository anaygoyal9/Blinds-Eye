import React, { useEffect, useRef } from 'react';
import { X, Check, Volume2, Smartphone, Type, Sliders, Server, RotateCcw } from 'lucide-react';
import { AppSettings, ContrastTheme, SpeechRate, TextSize, AlertFrequency } from '../types/navigation';
import { hapticService } from '../services/hapticService';
import { speechService } from '../services/speechService';
import { audioService } from '../services/audioService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onResetSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hapticsAvailable = hapticService.isSupported();
  const speechAvailable = speechService.isSupported();
  const audioAvailable = audioService.isSupported();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[#0e141d] border-3 border-cyan-500 rounded-3xl p-6 md:p-8 shadow-2xl my-8 text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#243242] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Sliders className="w-7 h-7 text-cyan-400" aria-hidden="true" />
            <h2 id="settings-title" className="text-2xl md:text-3xl font-black text-white">
              Accessibility & Settings
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2.5 bg-[#182230] hover:bg-[#253549] border border-[#3b506b] rounded-xl text-white font-bold transition-colors cursor-pointer"
            aria-label="Close Settings dialog (Shortcut: Escape)"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section 1: Typography & Contrast */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <h3 className="font-extrabold text-base md:text-lg text-white uppercase tracking-wider">
                Visual & Typography Sizing
              </h3>
            </div>

            {/* Text Size */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Text Scale
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'extra-large'] as TextSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ textSize: size })}
                    className={`py-2.5 px-2 rounded-xl text-xs md:text-sm font-extrabold capitalize border-2 transition-colors cursor-pointer ${
                      settings.textSize === size
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-[#1b2634] border-[#2e3f54] text-gray-300 hover:bg-[#223143]'
                    }`}
                    aria-pressed={settings.textSize === size}
                  >
                    {size.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Theme */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Contrast Theme (WCAG AAA)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'standard-dark', label: 'Standard Dark' },
                    { id: 'ultra-high-contrast', label: 'Ultra Yellow/Black' },
                  ] as Array<{ id: ContrastTheme; label: string }>
                ).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateSettings({ contrastTheme: theme.id })}
                    className={`py-2.5 px-3 rounded-xl text-xs md:text-sm font-extrabold border-2 transition-colors cursor-pointer ${
                      settings.contrastTheme === theme.id
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-[#1b2634] border-[#2e3f54] text-gray-300 hover:bg-[#223143]'
                    }`}
                    aria-pressed={settings.contrastTheme === theme.id}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Speech Alerts */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                <h3 className="font-extrabold text-base md:text-lg text-white uppercase tracking-wider">
                  Speech Synthesis Alerts
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  speechAvailable
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-red-950 text-red-300 border-red-500'
                }`}
              >
                {speechAvailable ? 'Speech API Active' : 'Speech API Unavailable'}
              </span>
            </div>

            {/* Speech Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-[#243242]">
              <span className="font-bold text-sm text-gray-200">Enable Voice Output</span>
              <button
                role="switch"
                aria-checked={settings.voiceEnabled}
                onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`px-4 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 cursor-pointer transition-colors ${
                  settings.voiceEnabled
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-[#1b2634] border-[#2e3f54] text-gray-400'
                }`}
              >
                {settings.voiceEnabled ? 'VOICE ON' : 'VOICE OFF'}
              </button>
            </div>

            {/* Speech Rate */}
            <div className="mt-3">
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Voice Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['slow', 'normal', 'fast'] as SpeechRate[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSettings({ speechRate: rate })}
                    className={`py-2 px-2 rounded-xl text-xs md:text-sm font-extrabold capitalize border-2 transition-colors cursor-pointer ${
                      settings.speechRate === rate
                        ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                        : 'bg-[#1b2634] border-[#2e3f54] text-gray-300 hover:bg-[#223143]'
                    }`}
                    aria-pressed={settings.speechRate === rate}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Directional Spatial Audio */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <h3 className="font-extrabold text-base md:text-lg text-white uppercase tracking-wider">
                  Spatial Audio & Acoustic Cues
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  audioAvailable
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                    : 'bg-red-950 text-red-300 border-red-500'
                }`}
              >
                {audioAvailable ? 'Web Audio Supported' : 'Web Audio Unavailable'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#243242]">
              <div>
                <span className="font-bold text-sm text-gray-200 block">Stereo Spatial Panning</span>
                <span className="text-xs text-gray-400">Pans sound left/right based on obstacle angle</span>
              </div>
              <button
                role="switch"
                aria-checked={settings.spatialAudioEnabled}
                onClick={() =>
                  onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
                }
                className={`px-4 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 cursor-pointer transition-colors ${
                  settings.spatialAudioEnabled
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                    : 'bg-[#1b2634] border-[#2e3f54] text-gray-400'
                }`}
              >
                {settings.spatialAudioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2 mt-1">
              <div>
                <span className="font-bold text-sm text-gray-200 block">Directional Tone Cues</span>
                <span className="text-xs text-gray-400">Plays distinct pitch cues alongside voice</span>
              </div>
              <button
                role="switch"
                aria-checked={settings.audioCuesEnabled}
                onClick={() =>
                  onUpdateSettings({ audioCuesEnabled: !settings.audioCuesEnabled })
                }
                className={`px-4 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 cursor-pointer transition-colors ${
                  settings.audioCuesEnabled
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                    : 'bg-[#1b2634] border-[#2e3f54] text-gray-400'
                }`}
              >
                {settings.audioCuesEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section 4: Haptic Feedback */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" aria-hidden="true" />
                <h3 className="font-extrabold text-base md:text-lg text-white uppercase tracking-wider">
                  Haptic Vibration Rhythms
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  hapticsAvailable
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-gray-800 text-gray-400 border-gray-600'
                }`}
              >
                {hapticsAvailable ? 'Vibration Supported' : 'Hardware Unavailable on Device'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-sm text-gray-200">
                Directional Vibration Patterns
              </span>
              <button
                role="switch"
                aria-checked={settings.hapticEnabled}
                onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
                className={`px-4 py-1.5 rounded-xl font-black text-xs md:text-sm border-2 cursor-pointer transition-colors ${
                  settings.hapticEnabled
                    ? 'bg-amber-950 border-amber-400 text-amber-300'
                    : 'bg-[#1b2634] border-[#2e3f54] text-gray-400'
                }`}
              >
                {settings.hapticEnabled ? 'HAPTICS ON' : 'HAPTICS OFF'}
              </button>
            </div>
          </div>

          {/* Section 5: Alert Frequency / Debounce */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <h3 className="font-extrabold text-base md:text-lg text-white uppercase tracking-wider mb-2">
              Alert Repeat Frequency
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Controls how often ongoing obstacles are re-announced while in view.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'low', label: 'Low (4.5s)' },
                  { id: 'normal', label: 'Normal (2.5s)' },
                  { id: 'high', label: 'High (1.5s)' },
                ] as Array<{ id: AlertFrequency; label: string }>
              ).map((freq) => (
                <button
                  key={freq.id}
                  onClick={() => onUpdateSettings({ alertFrequency: freq.id })}
                  className={`py-2 px-2 rounded-xl text-xs md:text-sm font-extrabold border-2 transition-colors cursor-pointer ${
                    settings.alertFrequency === freq.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                      : 'bg-[#1b2634] border-[#2e3f54] text-gray-300 hover:bg-[#223143]'
                  }`}
                  aria-pressed={settings.alertFrequency === freq.id}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Backend Server URL */}
          <div className="bg-[#141c26] border-2 border-[#243242] rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-cyan-400" aria-hidden="true" />
              <label htmlFor="backend-url-input" className="font-extrabold text-base text-white uppercase tracking-wider">
                ML Backend Server URL
              </label>
            </div>
            <input
              id="backend-url-input"
              type="text"
              value={settings.backendUrl}
              onChange={(e) => onUpdateSettings({ backendUrl: e.target.value })}
              placeholder="http://127.0.0.1:8000"
              className="w-full bg-[#0a0f16] border-2 border-[#3b506b] text-white px-4 py-3 rounded-xl font-mono text-base focus:border-cyan-400 focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-2">
              Default is <code className="text-cyan-300">http://127.0.0.1:8000</code>. For mobile access, enter your laptop's local LAN IP (e.g. <code className="text-cyan-300">http://192.168.1.x:8000</code>).
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t-2 border-[#243242] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onResetSettings}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#182230] hover:bg-[#253549] text-gray-300 border border-[#3b506b] rounded-xl font-bold text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black border-2 border-white rounded-xl font-black text-base transition-colors shadow-lg cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" aria-hidden="true" />
            <span>Done (Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
