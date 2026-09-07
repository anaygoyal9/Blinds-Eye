import { useState } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { DirectionIndicator } from './components/DirectionIndicator';
import { ObstaclesList } from './components/ObstaclesList';
import { Controls } from './components/Controls';
import { VideoFeed } from './components/VideoFeed';
import { TestModePanel } from './components/TestModePanel';
import { LogsPanel } from './components/LogsPanel';
import { SafetyDisclaimer } from './components/SafetyDisclaimer';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { useNavigationEngine } from './hooks/useNavigationEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { apiService } from './services/api';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings, resetSettings } = useSettings();

  const {
    isRunning,
    appMode,
    backendStatus,
    activeAlert,
    logs,
    setAppMode,
    toggleNavigation,
    stopNavigation,
    triggerManualTest,
  } = useNavigationEngine(settings);

  // Keyboard shortcut binding
  useKeyboardShortcuts({
    toggleNavigation,
    stopNavigation,
    appMode,
    setAppMode,
    openSettings: () => setIsSettingsOpen(true),
    closeSettings: () => setIsSettingsOpen(false),
    isSettingsOpen,
    settings,
    updateSettings,
  });

  const videoFeedUrl = apiService.getVideoFeedUrl(settings.backendUrl);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
      {/* Skip to Main Content for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-[var(--color-focus)] focus:text-black focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main navigation content
      </a>

      {/* Persistent ARIA Live Region for screen reader engines */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {isRunning
          ? `${activeAlert.title}. ${activeAlert.detail}`
          : 'Navigation is currently in standby.'}
      </div>

      {/* Header - Compact Single Row with Right-Aligned A11y Toolbar */}
      <Header
        backendStatus={backendStatus}
        appMode={appMode}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUpdateSettings={updateSettings}
      />

      {/* Main Content Area - Immediate Low-Vision Primary Interface */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto p-3 md:p-5 flex flex-col gap-4">
        {/* Compact Top Status & Control Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-4">
            <StatusBanner
              activeAlert={activeAlert}
              isRunning={isRunning}
              backendStatus={backendStatus}
            />
          </div>
          <div className="md:col-span-8">
            <Controls
              isRunning={isRunning}
              appMode={appMode}
              settings={settings}
              onToggleRunning={toggleNavigation}
              onSetAppMode={setAppMode}
              onUpdateSettings={updateSettings}
            />
          </div>
        </div>

        {/* 1. PRIMARY MAIN INTERFACE: SPATIAL DIRECTION RADAR */}
        <DirectionIndicator activeAlert={activeAlert} isRunning={isRunning} />

        {/* 2. IMMEDIATE SECONDARY INTERFACE: PRIORITIZED OBSTACLES LIST */}
        <ObstaclesList
          obstacles={activeAlert.allObstacles}
          isRunning={isRunning}
        />

        {/* 3. DIAGNOSTIC MATRIX (When in Test Mode) */}
        {appMode === 'test' && (
          <TestModePanel onTriggerTest={triggerManualTest} />
        )}

        {/* 4. SIGHTED COMPANION LIVE STREAM (Toggleable) */}
        <VideoFeed
          videoUrl={videoFeedUrl}
          backendStatus={backendStatus}
          isDemoMode={appMode === 'demo'}
          showFeed={settings.showVideoFeed}
          onToggleShowFeed={(show) => updateSettings({ showVideoFeed: show })}
        />

        {/* 5. RECENT SPOKEN ANNOUNCEMENTS LOG */}
        <LogsPanel logs={logs} />

        {/* 6. SAFETY DISCLAIMER */}
        <SafetyDisclaimer />
      </main>

      {/* Compact Accessible Footer */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-card)] py-4 px-4 text-center text-xs text-[var(--text-secondary)] transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-bold">
            <strong className="text-[var(--text-primary)] font-black">Blind's Eye v1.0</strong> — Assistive Spatial Navigation Prototype
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-[var(--text-primary)]">
            <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>Space</kbd> Start/Stop</span>
            <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>S</kbd> Settings</span>
            <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>M</kbd> Mode</span>
            <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>V</kbd> Voice</span>
            <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>H</kbd> Haptics</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />
    </div>
  );
}
