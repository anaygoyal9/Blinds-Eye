import { useState, useEffect, useCallback } from 'react';
import { AppSettings, ContrastTheme, TextSize } from '../types/navigation';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../utils/constants';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply visual theme and font-size class to document root
  useEffect(() => {
    const root = document.documentElement;

    // Contrast theme
    if (settings.contrastTheme === 'ultra-high-contrast') {
      root.classList.add('theme-ultra-contrast');
    } else {
      root.classList.remove('theme-ultra-contrast');
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
  }, [settings.contrastTheme, settings.textSize]);

  // Persist to localStorage
  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
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
