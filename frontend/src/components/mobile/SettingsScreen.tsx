import React, { useState } from 'react';
import {
  ArrowLeft,
  Volume2,
  Smartphone,
  Compass,
  Watch,
  Users,
  Sliders,
  ChevronRight,
  PhoneCall,
  SunMoon,
} from 'lucide-react';
import { AppSettings, ContrastTheme, TextSize } from '../../types/navigation';
import { hapticService } from '../../services/hapticService';
import { speechService } from '../../services/speechService';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onBack: () => void;
  onOpenEmergencySOS: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack,
  onOpenEmergencySOS,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const toggleContrast = () => {
    const nextTheme: ContrastTheme =
      settings.contrastTheme === 'ultra-high-contrast' ? 'standard-dark' : 'ultra-high-contrast';
    onUpdateSettings({ contrastTheme: nextTheme });
  };

  const handleTestVibration = () => {
    hapticService.alertLeft();
    speechService.speak('Testing vibration rhythm.');
  };

  const handleTestVoice = () => {
    speechService.speak('Voice alerts are active. Speech synthesis is operational.');
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Header */}
      <header className="flex items-center gap-3 py-2 border-b border-[var(--border-subtle)] mb-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
          Settings
        </h1>
      </header>

      {/* Main Settings List (Wireframe Screen 8) */}
      <div className="flex flex-col gap-2.5 mb-6">
        {/* 1. Voice Alerts */}
        <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-emerald-400">
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)]">Voice Alerts</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ voiceEnabled: !settings.voiceEnabled })}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                settings.voiceEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                  : 'bg-gray-800 text-gray-400 border border-gray-600'
              }`}
            >
              {settings.voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          {settings.voiceEnabled && (
            <button
              onClick={handleTestVoice}
              className="mt-2 text-xs text-[var(--color-focus)] hover:underline font-semibold"
            >
              Test Voice Announcement →
            </button>
          )}
        </div>

        {/* 2. Vibration Settings */}
        <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-yellow-400">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)]">Vibration Settings</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ hapticEnabled: !settings.hapticEnabled })}
              className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                settings.hapticEnabled
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400'
                  : 'bg-gray-800 text-gray-400 border border-gray-600'
              }`}
            >
              {settings.hapticEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          {settings.hapticEnabled && (
            <button
              onClick={handleTestVibration}
              className="mt-2 text-xs text-yellow-400 hover:underline font-semibold"
            >
              Test Vibration Rhythm →
            </button>
          )}
        </div>

        {/* 3. Navigation Preferences */}
        <div
          onClick={() => setActiveSubmenu(activeSubmenu === 'nav' ? null : 'nav')}
          className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] rounded-2xl cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)]">Navigation Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
          </div>

          {activeSubmenu === 'nav' && (
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <p className="mb-2 font-bold">Alert Sensitivity Frequency:</p>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'normal', 'high'] as const).map((freq) => (
                  <button
                    key={freq}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateSettings({ alertFrequency: freq });
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold capitalize border ${
                      settings.alertFrequency === freq
                        ? 'bg-[var(--color-focus)] text-black font-black'
                        : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. Wearable Device */}
        <div className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-[var(--color-focus)]">
              <Watch className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-base text-[var(--text-primary)] block">Wearable Device</span>
              <span className="text-xs text-emerald-400 font-mono">Connected · Battery 85%</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {/* 5. Emergency Contacts */}
        <div
          onClick={onOpenEmergencySOS}
          className="flex items-center justify-between p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-red-400 rounded-2xl cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-red-400">
              <Users className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-bold text-base text-[var(--text-primary)] block">Emergency Contacts</span>
              <span className="text-xs text-[var(--text-muted)] font-mono">Mom, Caregiver (2 contacts)</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
        </div>

        {/* 6. App Preferences (High Contrast & Font Size) */}
        <div
          onClick={() => setActiveSubmenu(activeSubmenu === 'app' ? null : 'app')}
          className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] rounded-2xl cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--bg-card-raised)] flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-base text-[var(--text-primary)]">App Preferences</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
          </div>

          {activeSubmenu === 'app' && (
            <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-3">
              <div>
                <span className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase">
                  Text Scale
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'normal', label: 'Normal (A-)' },
                      { id: 'large', label: 'Large (A)' },
                      { id: 'extra-large', label: 'XL (A+)' },
                    ] as Array<{ id: TextSize; label: string }>
                  ).map((size) => (
                    <button
                      key={size.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateSettings({ textSize: size.id });
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border ${
                        settings.textSize === size.id
                          ? 'bg-[var(--color-focus)] text-black font-black'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-[var(--text-muted)] mb-1.5 uppercase">
                  Low-Vision Contrast Theme
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleContrast();
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold border flex items-center justify-center gap-2 cursor-pointer ${
                    settings.contrastTheme === 'ultra-high-contrast'
                      ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                      : 'border-[var(--border-subtle)] text-[var(--text-primary)]'
                  }`}
                >
                  <SunMoon className="w-4 h-4" />
                  <span>
                    {settings.contrastTheme === 'ultra-high-contrast'
                      ? '⚡ Yellow/Black (Active)'
                      : 'Switch to Ultra Yellow/Black'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency SOS Call Button (Screen 8 Bottom) */}
      <div className="mt-auto">
        <button
          onClick={onOpenEmergencySOS}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-black text-lg tracking-wider flex items-center justify-center gap-3 shadow-2xl border-2 border-white cursor-pointer transition-all animate-pulse"
          aria-label="SOS Emergency Call. Alert emergency contacts and services."
        >
          <PhoneCall className="w-6 h-6 fill-current" aria-hidden="true" />
          <span>SOS — Emergency Call</span>
        </button>
      </div>
    </div>
  );
};
