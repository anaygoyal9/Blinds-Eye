import { useState, useEffect, useCallback } from 'react';
import { AppSettings, ContrastTheme, TextSize } from '../types/navigation';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../utils/constants';

const THEME_MIGRATION_KEY = 'blinds_eye_theme_v2_migrated';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Automatically migrate legacy default 'standard-dark' to 'bright-day' once
        const migrated = localStorage.getItem(THEME_MIGRATION_KEY);
        if (!migrated && parsed.contrastTheme === 'standard-dark') {
          parsed.contrastTheme = 'bright-day';
          localStorage.setItem(THEME_MIGRATION_KEY, 'true');
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...DEFAULT_SETTINGS, ...parsed }));
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply visual theme and font-size class to document root
  useEffect(() => {
    const root = document.documentElement;

    const applyVisualTheme = (theme: ContrastTheme) => {
      root.classList.remove('theme-light', 'theme-dark', 'theme-ultra-contrast');
      if (theme === 'ultra-high-contrast') {
        root.classList.add('theme-ultra-contrast');
      } else if (theme === 'standard-dark') {
        root.classList.add('theme-dark');
      } else if (theme === 'bright-day') {
        root.classList.add('theme-light');
      } else if (theme === 'system') {
        const isSystemDark =
          typeof window !== 'undefined' &&
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(isSystemDark ? 'theme-dark' : 'theme-light');
      }
    };

    applyVisualTheme(settings.contrastTheme);

    // If system mode, dynamically react to OS dark/bright changes in real time
    let cleanupListener: (() => void) | undefined;
    if (settings.contrastTheme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleMediaChange = (e: MediaQueryListEvent) => {
        root.classList.remove('theme-light', 'theme-dark', 'theme-ultra-contrast');
        root.classList.add(e.matches ? 'theme-dark' : 'theme-light');
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleMediaChange);
        cleanupListener = () => mediaQuery.removeEventListener('change', handleMediaChange);
      } else if ('addListener' in mediaQuery) {
        // Fallback for older Safari/WebKit
        (mediaQuery as unknown as { addListener: (cb: (e: MediaQueryListEvent) => void) => void }).addListener(handleMediaChange);
        cleanupListener = () =>
          (mediaQuery as unknown as { removeListener: (cb: (e: MediaQueryListEvent) => void) => void }).removeListener(handleMediaChange);
      }
    }

    // Text size
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-extra-large');
    if (settings.textSize === 'large') {
      root.classList.add('text-size-large');
    } else if (settings.textSize === 'extra-large') {
      root.classList.add('text-size-extra-large');
    } else {
      root.classList.add('text-size-normal');
    }

    return () => {
      if (cleanupListener) cleanupListener();
    };
  }, [settings.contrastTheme, settings.textSize]);

  // Persist to localStorage
  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(THEME_MIGRATION_KEY, 'true');
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save settings to localStorage:', e);
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.warn('Failed to reset settings:', e);
    }
  }, []);

  const setTextSize = useCallback((textSize: TextSize) => {
    updateSettings({ textSize });
  }, [updateSettings]);

  const setContrastTheme = useCallback((contrastTheme: ContrastTheme) => {
    updateSettings({ contrastTheme });
  }, [updateSettings]);

  return {
    settings,
    updateSettings,
    resetSettings,
    setTextSize,
    setContrastTheme,
  };
}
