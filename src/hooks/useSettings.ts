import { useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 13,
};

export type Settings = typeof DEFAULT_SETTINGS;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('editor-settings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('editor-settings', JSON.stringify(settings));
  }, [settings]);

  const updateFontFamily = (family: string) => {
    setSettings(prev => ({ ...prev, fontFamily: family }));
  };

  const updateFontSize = (size: number) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  return { settings, updateFontFamily, updateFontSize };
}
