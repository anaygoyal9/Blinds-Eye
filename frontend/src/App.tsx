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

      {/* Header with Government-Style Accessibility Toolbar (A-, A, A+ & High Contrast) */}
      <Header
        backendStatus={backendStatus}
        appMode={appMode}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUpdateSettings={updateSettings}
      />

      {/* Main Content Area - Optimized for Low-Vision & Blind Users */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* 1. System Status Banner (At the very top) */}
        <StatusBanner
          activeAlert={activeAlert}
          isRunning={isRunning}
          backendStatus={backendStatus}
        />

        {/* 2. Spatial Direction Radar (Immediately beneath status) */}
        <DirectionIndicator activeAlert={activeAlert} isRunning={isRunning} />

        {/* 3. Prioritized Obstacles List */}
        <ObstaclesList
          obstacles={activeAlert.allObstacles}
          isRunning={isRunning}
        />

        {/* 4. Primary Navigation Controls (Large Start/Stop, Operating Modes, Quick Toggles) */}
        <Controls
          isRunning={isRunning}
          appMode={appMode}
          settings={settings}
          onToggleRunning={toggleNavigation}
          onSetAppMode={setAppMode}
          onUpdateSettings={updateSettings}
        />

        {/* 5. Interactive Diagnostic Test Matrix (when in Test Mode) */}
        {appMode === 'test' && (
          <TestModePanel onTriggerTest={triggerManualTest} />
        )}

        {/* 6. Live RGB + Depth Camera Stream for Sighted Companion */}
        <VideoFeed
          videoUrl={videoFeedUrl}
          backendStatus={backendStatus}
          isDemoMode={appMode === 'demo'}
          showFeed={settings.showVideoFeed}
          onToggleShowFeed={(show) => updateSettings({ showVideoFeed: show })}
        />

        {/* 7. Spoken Announcement History Log */}
        <LogsPanel logs={logs} />

        {/* 8. Safety Disclaimer */}
        <SafetyDisclaimer />
      </main>

      {/* Accessible Footer */}
      <footer className="w-full border-t-2 border-[var(--border-subtle)] bg-[var(--bg-card)] py-6 px-4 text-center text-xs md:text-sm text-[var(--text-secondary)] transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-bold">
            <strong className="text-[var(--text-primary)] font-black">Blind's Eye v1.0.0</strong> — Assistive Spatial Navigation System
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 font-mono text-xs text-[var(--text-primary)]">
            <span className="bg-[var(--bg-card-raised)] px-2 py-1 rounded border border-[var(--border-subtle)]"><kbd>Space</kbd> Start/Stop</span>
            <span className="bg-[var(--bg-card-raised)] px-2 py-1 rounded border border-[var(--border-subtle)]"><kbd>S</kbd> Settings</span>
            <span className="bg-[var(--bg-card-raised)] px-2 py-1 rounded border border-[var(--border-subtle)]"><kbd>M</kbd> Mode</span>
            <span className="bg-[var(--bg-card-raised)] px-2 py-1 rounded border border-[var(--border-subtle)]"><kbd>V</kbd> Voice</span>
            <span className="bg-[var(--bg-card-raised)] px-2 py-1 rounded border border-[var(--border-subtle)]"><kbd>H</kbd> Haptics</span>
          </div>
        </div>
      </footer>

      {/* Accessibility & Controls Modal */}
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
