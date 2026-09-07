import { useState } from 'react';
import { Header } from './components/Header';
import { StatusBanner } from './components/StatusBanner';
import { DirectionIndicator } from './components/DirectionIndicator';
import { Controls } from './components/Controls';
import { ObstaclesList } from './components/ObstaclesList';
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
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      {/* Skip to Main Content for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-cyan-400 focus:text-black focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main navigation content
      </a>

      {/* Persistent ARIA Live Region for screen reader assistive engines */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {isRunning
          ? `${activeAlert.title}. ${activeAlert.detail}`
          : 'Navigation is currently in standby.'}
      </div>

      {/* Header */}
      <Header
        backendStatus={backendStatus}
        appMode={appMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* System Status Banner */}
        <StatusBanner
          activeAlert={activeAlert}
          isRunning={isRunning}
          backendStatus={backendStatus}
        />

        {/* Primary Controls (Start / Stop / Modes / Quick Toggles) */}
        <Controls
          isRunning={isRunning}
          appMode={appMode}
          settings={settings}
          onToggleRunning={toggleNavigation}
          onSetAppMode={setAppMode}
          onUpdateSettings={updateSettings}
        />

        {/* Spatial Direction Indicator */}
        <DirectionIndicator activeAlert={activeAlert} isRunning={isRunning} />

        {/* Interactive Diagnostic Test Matrix (when in Test Mode) */}
        {appMode === 'test' && (
          <TestModePanel onTriggerTest={triggerManualTest} />
        )}

        {/* Prioritized Obstacles List */}
        <ObstaclesList
          obstacles={activeAlert.allObstacles}
          isRunning={isRunning}
        />

        {/* Live RGB + Depth Camera Stream */}
        <VideoFeed
          videoUrl={videoFeedUrl}
          backendStatus={backendStatus}
          isDemoMode={appMode === 'demo'}
          showFeed={settings.showVideoFeed}
          onToggleShowFeed={(show) => updateSettings({ showVideoFeed: show })}
        />

        {/* Recent Alert Logs */}
        <LogsPanel logs={logs} />

        {/* Safety Disclaimer */}
        <SafetyDisclaimer />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#1e2a38] bg-[#070b10] py-6 px-4 text-center text-xs md:text-sm text-gray-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>Blind's Eye v1.0.0</strong> — Assistive Spatial Navigation Prototype
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-gray-400">
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">Space</kbd> Start/Stop</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">S</kbd> Settings</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">M</kbd> Mode</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">V</kbd> Voice</span>
            <span><kbd className="bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">H</kbd> Haptics</span>
          </div>
        </div>
      </footer>

      {/* Accessibility & Settings Modal */}
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
