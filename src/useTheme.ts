import { useState, useEffect } from 'react';

type ThemePreference = 'light' | 'dark';

const STORAGE_KEY = 'scorecard-theme';

function getSystemTheme(): ThemePreference {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Manages light/dark theme preference.
 * Priority: manual override (localStorage) > system preference.
 * Applies [data-theme] attribute to <html> so CSS tokens activate.
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
    return stored ?? getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Keep in sync if the system preference changes while the tab is open
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function onSystemChange(e: MediaQueryListEvent) {
      // Only follow system if the user hasn't manually picked a theme
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setTheme(e.matches ? 'dark' : 'light');
    }
    mq.addEventListener('change', onSystemChange);
    return () => mq.removeEventListener('change', onSystemChange);
  }, []);

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggle };
}
