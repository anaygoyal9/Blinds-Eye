import React from 'react';
import {
  Menu,
  Settings as SettingsIcon,
  Watch,
  BatteryCharging,
  Navigation as NavigationIcon,
  AlertTriangle,
  PhoneCall,
  ChevronRight,
  SunMoon,
} from 'lucide-react';
import { AppSettings, BackendStatus, ContrastTheme } from '../../types/navigation';

interface HomeScreenProps {
  onStartNavigation: () => void;
  onOpenObstacleDetection: () => void;
  onOpenEmergencySOS: () => void;
  onOpenSettings: () => void;
  backendStatus: BackendStatus;
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  batteryLevel?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartNavigation,
  onOpenObstacleDetection,
  onOpenEmergencySOS,
  onOpenSettings,
  backendStatus,
  settings,
  onUpdateSettings,
  batteryLevel = 85,
}) => {
  const isUltraContrast = settings.contrastTheme === 'ultra-high-contrast';

  const toggleContrast = () => {
    const nextTheme: ContrastTheme = isUltraContrast ? 'standard-dark' : 'ultra-high-contrast';
    onUpdateSettings({ contrastTheme: nextTheme });
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-3 pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] max-w-md mx-auto transition-colors">
      {/* Top Header */}
      <header className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] mb-3">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
          aria-label="Open App Menu"
        >
          <Menu className="w-6 h-6" aria-hidden="true" />
        </button>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)] font-display">
          BlindEye
        </h1>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-[var(--text-primary)] hover:bg-white/10 cursor-pointer"
          aria-label="Open Settings"
        >
          <SettingsIcon className="w-6 h-6 text-[var(--color-focus)]" aria-hidden="true" />
        </button>
      </header>

      {/* Quick A11y Font & Contrast Bar */}
      <div className="flex items-center justify-between mb-4 px-1 gap-2">
        <div
          role="group"
          aria-label="Quick Text Scale"
          className="flex items-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg p-0.5 text-xs font-bold"
        >
          <span className="text-[10px] px-1 text-[var(--text-muted)] font-mono">SIZE:</span>
          {(['normal', 'large', 'extra-large'] as const).map((sz, idx) => (
            <button
              key={sz}
              onClick={() => onUpdateSettings({ textSize: sz })}
              className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                settings.textSize === sz
                  ? 'bg-[var(--color-focus)] text-black font-black'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+'}
            </button>
          ))}
        </div>

        <button
          onClick={toggleContrast}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
            isUltraContrast
              ? 'bg-[#ffff00] text-black border-[#ffff00] font-black'
              : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)]'
          }`}
          aria-label="Toggle Yellow/Black High Contrast"
        >
          <SunMoon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{isUltraContrast ? 'Yellow/Black' : 'Contrast'}</span>
        </button>
      </div>

      {/* Main Feature Cards List */}
      <div className="flex flex-col gap-3.5">
        {/* Card 1: Device Connected */}
        <div
          className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] rounded-2xl shadow-sm transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--color-focus)] flex-shrink-0">
              <Watch className="w-6 h-6 stroke-[2.2]" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-bold text-base text-[var(--text-primary)]">
                Device Connected
              </span>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)] font-mono">
                <BatteryCharging className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Battery : {batteryLevel}%</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                <span className="capitalize">{backendStatus}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
        </div>

        {/* Card 2: Start Navigation */}
        <button
          onClick={onStartNavigation}
          className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--color-focus)] active:scale-[0.99] rounded-2xl shadow-sm text-left transition-all cursor-pointer group"
          aria-label="Start Navigation. Get directions to a place"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] group-hover:border-[var(--color-focus)] flex items-center justify-center text-[var(--color-focus)] flex-shrink-0">
              <NavigationIcon className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-black text-lg text-[var(--text-primary)]">
                Start Navigation
              </span>
              <span className="block text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                Get directions to a place
              </span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[var(--text-muted)] group-hover:text-[var(--color-focus)] transition-colors flex-shrink-0" aria-hidden="true" />
        </button>

        {/* Card 3: Obstacle Detection */}
        <button
          onClick={onOpenObstacleDetection}
          className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-yellow-400 active:scale-[0.99] rounded-2xl shadow-sm text-left transition-all cursor-pointer group"
          aria-label="Obstacle Detection. Live alerts while walking"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] group-hover:border-yellow-400 flex items-center justify-center text-yellow-400 flex-shrink-0">
              <AlertTriangle className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-black text-lg text-[var(--text-primary)]">
                Obstacle Detection
              </span>
              <span className="block text-xs sm:text-sm text-[var(--text-muted)] font-medium">
                Live alerts while walking
              </span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-[var(--text-muted)] group-hover:text-yellow-400 transition-colors flex-shrink-0" aria-hidden="true" />
        </button>

        {/* Card 4: Emergency SOS */}
        <button
          onClick={onOpenEmergencySOS}
          className="flex items-center justify-between p-4 bg-[var(--bg-card)] border border-red-500/50 hover:border-red-400 active:scale-[0.99] rounded-2xl shadow-sm text-left transition-all cursor-pointer group"
          aria-label="Emergency SOS. Call your contacts"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500 flex items-center justify-center text-red-300 flex-shrink-0">
              <PhoneCall className="w-6 h-6 stroke-[2.5]" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-black text-lg text-red-200">
                Emergency SOS
              </span>
              <span className="block text-xs sm:text-sm text-red-300/80 font-medium">
                Call your contacts
              </span>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-red-400 flex-shrink-0" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
