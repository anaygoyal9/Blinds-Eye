import React, { useEffect, useRef } from 'react';
import { X, Check, Volume2, Smartphone, Type, Sliders, RotateCcw, SunMoon } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-[var(--bg-card)] border-4 border-[var(--border-strong)] rounded-3xl p-6 md:p-8 shadow-2xl my-8 text-[var(--text-primary)] max-h-[90vh] overflow-y-auto transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-[var(--border-subtle)] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Sliders className="w-8 h-8 text-[var(--color-focus)]" aria-hidden="true" />
            <h2 id="settings-title" className="text-2xl md:text-3xl font-black text-[var(--text-primary)]">
              Accessibility & Controls
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-3 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] border-2 border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] font-black transition-colors cursor-pointer"
            aria-label="Close Settings dialog (Shortcut: Escape)"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section 1: Typography & Scientific Low-Vision Contrast */}
          <div className="bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Type className="w-6 h-6 text-[var(--color-focus)]" aria-hidden="true" />
              <h3 className="font-black text-lg md:text-xl text-[var(--text-primary)] uppercase tracking-wider">
                Typography & Contrast Modes
              </h3>
            </div>

            {/* Text Size */}
            <div className="mb-5">
              <label className="block text-sm font-black text-[var(--text-primary)] mb-2">
                Text Scale (A- / A / A+)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'normal', label: 'Normal (18px)' },
                    { id: 'large', label: 'Large (22px)' },
                    { id: 'extra-large', label: 'Extra Large (26px)' },
                  ] as Array<{ id: TextSize; label: string }>
                ).map((size) => (
                  <button
                    key={size.id}
                    onClick={() => onUpdateSettings({ textSize: size.id })}
                    className={`py-3 px-2 rounded-xl text-xs md:text-sm font-black border-3 transition-all cursor-pointer ${
                      settings.textSize === size.id
                        ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)] shadow-lg'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--color-focus)]'
                    }`}
                    aria-pressed={settings.textSize === size.id}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Theme */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-black text-[var(--text-primary)]">
                  Scientific Low-Vision Color Contrast (WCAG AAA)
                </label>
                <SunMoon className="w-4 h-4 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    {
                      id: 'standard-dark',
                      title: 'Standard Dark',
                      subtitle: 'White text on deep dark surface (18:1 contrast)',
                    },
                    {
                      id: 'ultra-high-contrast',
                      title: '⚡ Ultra Yellow / Black',
                      subtitle: 'Pure yellow on true pitch black (21:1 contrast)',
                    },
                  ] as Array<{ id: ContrastTheme; title: string; subtitle: string }>
                ).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onUpdateSettings({ contrastTheme: theme.id })}
                    className={`p-3 rounded-xl text-left border-3 transition-all cursor-pointer ${
                      settings.contrastTheme === theme.id
                        ? 'bg-yellow-400 text-black border-yellow-400 font-black shadow-lg scale-[1.02]'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-yellow-400'
                    }`}
                    aria-pressed={settings.contrastTheme === theme.id}
                  >
                    <span className="block font-black text-sm md:text-base">{theme.title}</span>
                    <span className="text-[11px] block mt-0.5 opacity-80">{theme.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Speech Alerts */}
          <div className="bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-[#00e676]" aria-hidden="true" />
                <h3 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-wider">
                  Spoken Announcements
                </h3>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg border-2 ${
                  speechAvailable
                    ? 'bg-[#003314] text-[#00ff66] border-[#00ff66]'
                    : 'bg-red-950 text-red-300 border-red-500'
                }`}
              >
                {speechAvailable ? 'Speech API Active' : 'Speech API Unavailable'}
              </span>
            </div>

            {/* Speech Toggle */}
            <div className="flex items-center justify-between py-2.5 border-b-2 border-[var(--border-subtle)]">
              <span className="font-bold text-base text-[var(--text-primary)]">Voice Output</span>
              <button
                role="switch"
                aria-checked={settings.voiceEnabled}
                onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
                className={`px-5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-colors ${
                  settings.voiceEnabled
                    ? 'bg-[#00e676] text-black border-[#00e676]'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {settings.voiceEnabled ? 'VOICE ON' : 'VOICE OFF'}
              </button>
            </div>

            {/* Speech Rate */}
            <div className="mt-4">
              <label className="block text-sm font-black text-[var(--text-primary)] mb-2">
                Voice Speed
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['slow', 'normal', 'fast'] as SpeechRate[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateSettings({ speechRate: rate })}
                    className={`py-2.5 px-2 rounded-xl text-xs md:text-sm font-black capitalize border-2 transition-colors cursor-pointer ${
                      settings.speechRate === rate
                        ? 'bg-[#00e676] text-black border-[#00e676]'
                        : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#00e676]'
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
          <div className="bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-6 h-6 text-[var(--color-focus)]" aria-hidden="true" />
                <h3 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-wider">
                  Spatial Audio & Acoustic Cues
                </h3>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg border-2 ${
                  audioAvailable
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400'
                    : 'bg-red-950 text-red-300 border-red-500'
                }`}
              >
                {audioAvailable ? 'Web Audio Active' : 'Web Audio Unavailable'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b-2 border-[var(--border-subtle)]">
              <div>
                <span className="font-bold text-base text-[var(--text-primary)] block">Stereo Spatial Panning</span>
                <span className="text-xs text-[var(--text-muted)]">Pans obstacle cues to left/right ear</span>
              </div>
              <button
                role="switch"
                aria-checked={settings.spatialAudioEnabled}
                onClick={() =>
                  onUpdateSettings({ spatialAudioEnabled: !settings.spatialAudioEnabled })
                }
                className={`px-5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-colors ${
                  settings.spatialAudioEnabled
                    ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {settings.spatialAudioEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5 mt-2">
              <div>
                <span className="font-bold text-base text-[var(--text-primary)] block">Directional Tone Cues</span>
                <span className="text-xs text-[var(--text-muted)]">Plays distinct pitch cues alongside speech</span>
              </div>
              <button
                role="switch"
                aria-checked={settings.audioCuesEnabled}
                onClick={() =>
                  onUpdateSettings({ audioCuesEnabled: !settings.audioCuesEnabled })
                }
                className={`px-5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-colors ${
                  settings.audioCuesEnabled
                    ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {settings.audioCuesEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section 4: Haptic Feedback */}
          <div className="bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                <h3 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-wider">
                  Haptic Vibration Rhythms
                </h3>
              </div>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-lg border-2 ${
                  hapticsAvailable
                    ? 'bg-yellow-950 text-yellow-300 border-yellow-400'
                    : 'bg-gray-800 text-gray-400 border-gray-600'
                }`}
              >
                {hapticsAvailable ? 'Vibration Supported' : 'Hardware Unavailable on Device'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="font-bold text-base text-[var(--text-primary)]">
                Directional Vibration Patterns
              </span>
              <button
                role="switch"
                aria-checked={settings.hapticEnabled}
                onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
                className={`px-5 py-2 rounded-xl font-black text-sm border-2 cursor-pointer transition-colors ${
                  settings.hapticEnabled
                    ? 'bg-yellow-400 text-black border-yellow-400'
                    : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {settings.hapticEnabled ? 'HAPTICS ON' : 'HAPTICS OFF'}
              </button>
            </div>
          </div>

          {/* Section 5: Alert Frequency / Debounce */}
          <div className="bg-[var(--bg-card-raised)] border-3 border-[var(--border-subtle)] rounded-2xl p-4 md:p-5">
            <h3 className="font-black text-lg text-[var(--text-primary)] uppercase tracking-wider mb-2">
              Alert Repeat Frequency
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-3">
              Controls how frequently ongoing detected obstacles are re-announced.
            </p>
            <div className="grid grid-cols-3 gap-2.5">
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
                  className={`py-2.5 px-2 rounded-xl text-xs md:text-sm font-black border-2 transition-colors cursor-pointer ${
                    settings.alertFrequency === freq.id
                      ? 'bg-[var(--color-focus)] text-black border-[var(--color-focus)]'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--color-focus)]'
                  }`}
                  aria-pressed={settings.alertFrequency === freq.id}
                >
                  {freq.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-7 pt-4 border-t-3 border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onResetSettings}
            className="flex items-center gap-2 px-5 py-3 bg-[var(--bg-card-raised)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] border-2 border-[var(--border-subtle)] rounded-2xl font-bold text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-7 py-3.5 bg-[var(--color-focus)] hover:opacity-90 text-black border-2 border-white rounded-2xl font-black text-lg transition-colors shadow-2xl cursor-pointer"
          >
            <Check className="w-6 h-6 stroke-[3]" aria-hidden="true" />
            <span>Done (Esc)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
