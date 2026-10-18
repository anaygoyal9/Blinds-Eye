import { useState, useEffect } from 'react';
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

// Mobile Screens matching wireframe
import { BottomNav, MobileTab } from './components/mobile/BottomNav';
import { SplashScreen } from './components/mobile/SplashScreen';
import { HomeScreen } from './components/mobile/HomeScreen';
import { DestinationScreen } from './components/mobile/DestinationScreen';
import { NavigationScreen } from './components/mobile/NavigationScreen';
import { ObstacleDetectionScreen } from './components/mobile/ObstacleDetectionScreen';
import { AlertsHistoryScreen } from './components/mobile/AlertsHistoryScreen';
import { SettingsScreen } from './components/mobile/SettingsScreen';
import { SosModal } from './components/mobile/SosModal';

import { useSettings } from './hooks/useSettings';
import { useNavigationEngine } from './hooks/useNavigationEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { apiService } from './services/api';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showSplash, setShowSplash] = useState(false);

  // Mobile navigation state
  const [currentMobileTab, setCurrentMobileTab] = useState<MobileTab | 'obstacle'>('home');
  const [mobileSubscreen, setMobileSubscreen] = useState<'none' | 'set-destination'>('none');
  const [destination, setDestination] = useState<string>('Library');
  const [batteryLevel, setBatteryLevel] = useState<number>(85);

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

  // Query actual battery level if supported
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as unknown as { getBattery: () => Promise<{ level: number }> })
        .getBattery()
        .then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
        })
        .catch(() => {});
    }
  }, []);

  const videoFeedUrl = apiService.getVideoFeedUrl(settings.backendUrl);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors flex flex-col">
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

      {/* Floating View Switcher Bar (Mobile Phone UI vs Full Desktop Dashboard) */}
      <div className="w-full bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-3 py-1.5 flex items-center justify-between text-xs font-bold z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-[var(--text-primary)] font-black">Blind's Eye</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">| Phone UI Mode</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--bg-card-raised)] border border-[var(--border-subtle)] rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-[var(--color-focus)] text-black font-black'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
            aria-pressed={viewMode === 'mobile'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone UI</span>
          </button>

          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-[var(--color-focus)] text-black font-black'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
            aria-pressed={viewMode === 'desktop'}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>

        <button
          onClick={() => setShowSplash(!showSplash)}
          className="text-[11px] text-[var(--color-focus)] hover:underline cursor-pointer"
        >
          {showSplash ? 'Exit Splash' : 'Splash Screen'}
        </button>
      </div>

      {/* -------------------- 1. PHONE UI VIEW (Wireframe Screens 1 - 8) -------------------- */}
      {viewMode === 'mobile' && (
        <main id="main-content" className="flex-1 w-full flex flex-col justify-center items-center p-0 sm:py-4">
          <div className="w-full max-w-md min-h-screen sm:min-h-[820px] bg-[var(--bg-main)] sm:border sm:border-[var(--border-subtle)] sm:rounded-3xl sm:shadow-2xl overflow-hidden relative flex flex-col">
            {showSplash ? (
              <SplashScreen onGetStarted={() => setShowSplash(false)} />
            ) : (
              <>
                {/* Screen 2: Home / Dashboard */}
                {currentMobileTab === 'home' && (
                  <HomeScreen
                    onStartNavigation={() => {
                      setCurrentMobileTab('navigate');
                      setMobileSubscreen('set-destination');
                    }}
                    onOpenObstacleDetection={() => setCurrentMobileTab('obstacle')}
                    onOpenEmergencySOS={() => setIsSosOpen(true)}
                    onOpenSettings={() => setCurrentMobileTab('settings')}
                    backendStatus={backendStatus}
                    settings={settings}
                    onUpdateSettings={updateSettings}
                    batteryLevel={batteryLevel}
                  />
                )}

                {/* Screen 3: Set Destination or Screens 4 & 6: Navigation Guide */}
                {currentMobileTab === 'navigate' && (
                  mobileSubscreen === 'set-destination' ? (
                    <DestinationScreen
                      onBack={() => setMobileSubscreen('none')}
                      onSelectDestination={(place) => {
                        setDestination(place);
                        setMobileSubscreen('none');
                        if (!isRunning) toggleNavigation();
                      }}
                    />
                  ) : (
                    <NavigationScreen
                      destination={destination}
                      onBack={() => setMobileSubscreen('set-destination')}
                      onStopNavigation={() => {
                        stopNavigation();
                        setMobileSubscreen('set-destination');
                      }}
                      onSwitchToObstacles={() => setCurrentMobileTab('obstacle')}
                    />
                  )
                )}

                {/* Screen 5: Obstacle Detection Alert & Radar */}
                {currentMobileTab === 'obstacle' && (
                  <ObstacleDetectionScreen
                    activeAlert={activeAlert}
                    isRunning={isRunning}
                    backendStatus={backendStatus}
                    settings={settings}
                    onToggleRunning={toggleNavigation}
                    onUpdateSettings={updateSettings}
                    onBack={() => setCurrentMobileTab('home')}
                  />
                )}

                {/* Screen 7: Alerts History */}
                {currentMobileTab === 'alerts' && (
                  <AlertsHistoryScreen
                    logs={logs}
                    onBack={() => setCurrentMobileTab('home')}
                  />
                )}

                {/* Screen 8: Settings & Emergency */}
                {currentMobileTab === 'settings' && (
                  <SettingsScreen
                    settings={settings}
                    onUpdateSettings={updateSettings}
                    onBack={() => setCurrentMobileTab('home')}
                    onOpenEmergencySOS={() => setIsSosOpen(true)}
                  />
                )}

                {/* Bottom Navigation Bar */}
                <BottomNav
                  currentTab={currentMobileTab === 'obstacle' ? 'navigate' : currentMobileTab}
                  onSelectTab={(tab) => {
                    setCurrentMobileTab(tab);
                    setMobileSubscreen('none');
                  }}
                  hasActiveAlert={activeAlert.isAlert}
                />
              </>
            )}
          </div>
        </main>
      )}

      {/* -------------------- 2. DESKTOP FULL DASHBOARD VIEW -------------------- */}
      {viewMode === 'desktop' && (
        <>
          <Header
            backendStatus={backendStatus}
            appMode={appMode}
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onUpdateSettings={updateSettings}
          />

          <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto p-3 md:p-5 flex flex-col gap-4">
            {/* Top Status & Control Row */}
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

            {/* 1. Spatial Direction Radar */}
            <DirectionIndicator activeAlert={activeAlert} isRunning={isRunning} />

            {/* 2. Prioritized Obstacles List */}
            <ObstaclesList
              obstacles={activeAlert.allObstacles}
              isRunning={isRunning}
            />

            {/* 3. Diagnostic Matrix (When in Test Mode) */}
            {appMode === 'test' && (
              <TestModePanel onTriggerTest={triggerManualTest} />
            )}

            {/* 4. Sighted Companion Live Stream */}
            <VideoFeed
              videoUrl={videoFeedUrl}
              backendStatus={backendStatus}
              isDemoMode={appMode === 'demo'}
              showFeed={settings.showVideoFeed}
              onToggleShowFeed={(show) => updateSettings({ showVideoFeed: show })}
            />

            {/* 5. Spoken Announcements History */}
            <LogsPanel logs={logs} />

            {/* 6. Safety Disclaimer */}
            <SafetyDisclaimer />
          </main>

          {/* Desktop Footer */}
          <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-card)] py-4 px-4 text-center text-xs text-[var(--text-secondary)] transition-colors">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="font-bold">
                <strong className="text-[var(--text-primary)] font-black">Blind's Eye v1.0</strong> — Assistive Spatial Navigation
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-[var(--text-primary)]">
                <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>Space</kbd> Start/Stop</span>
                <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>S</kbd> Settings</span>
                <span className="bg-[var(--bg-card-raised)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]"><kbd>M</kbd> Mode</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Emergency SOS Modal (Always available) */}
      <SosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

      {/* Settings Modal (Always available) */}
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
