import { useState, useEffect } from 'react';

export interface UserSettings {
  displayName: string;
  email: string;
  theme: 'dark' | 'light' | 'system';
  galleryView: 'grid' | 'list';
  notifications: boolean;
  confirmDelete: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  displayName: 'Siddhant Singh',
  email: 'siddhant@gmail.com',
  theme: 'dark',
  galleryView: 'grid',
  notifications: true,
  confirmDelete: true,
};

const STORAGE_KEY = 'image-gallery-settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const applyTheme = (theme: string) => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const newSettings = { ...DEFAULT_SETTINGS, ...parsed };
          setSettings(newSettings);
          applyTheme(newSettings.theme);
        } else {
          applyTheme(DEFAULT_SETTINGS.theme);
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
      setIsLoaded(true);
    };

    loadSettings();

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let currentTheme = DEFAULT_SETTINGS.theme;
        if (stored) {
          currentTheme = JSON.parse(stored).theme || currentTheme;
        }
        if (currentTheme === 'system') {
          if (e.matches) document.documentElement.classList.add('dark');
          else document.documentElement.classList.remove('dark');
        }
      } catch(err) {}
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadSettings();
      }
    };

    const handleCustomEvent = () => {
      loadSettings();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('settings-updated', handleCustomEvent);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settings-updated', handleCustomEvent);
    };
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    window.dispatchEvent(new Event('settings-updated'));
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    saveSettings({ ...settings, ...updates });
  };

  const resetSettings = () => {
    const resetValues = {
      ...DEFAULT_SETTINGS,
      displayName: '',
      email: '',
    };
    saveSettings(resetValues);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded
  };
}
