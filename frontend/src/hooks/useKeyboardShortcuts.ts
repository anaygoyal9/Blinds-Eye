import { useEffect } from 'react';
import { AppMode, AppSettings } from '../types/navigation';

interface KeyboardShortcutHandlers {
  toggleNavigation: () => void;
  stopNavigation: () => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

export function useKeyboardShortcuts({
  toggleNavigation,
  stopNavigation,
  appMode,
  setAppMode,
  openSettings,
  closeSettings,
  isSettingsOpen,
  settings,
  updateSettings,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if focus is inside an input/textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape' && isSettingsOpen) {
          closeSettings();
        }
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleNavigation();
      } else if (e.key === 'Escape') {
        if (isSettingsOpen) {
          closeSettings();
        } else {
          stopNavigation();
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (isSettingsOpen) {
          closeSettings();
        } else {
          openSettings();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setAppMode(appMode === 'assistance' ? 'demo' : 'assistance');
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setAppMode(appMode === 'test' ? 'assistance' : 'test');
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        updateSettings({ voiceEnabled: !settings.voiceEnabled });
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        updateSettings({ hapticEnabled: !settings.hapticEnabled });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    toggleNavigation,
    stopNavigation,
    appMode,
    setAppMode,
    openSettings,
    closeSettings,
    isSettingsOpen,
    settings,
    updateSettings,
  ]);
}
