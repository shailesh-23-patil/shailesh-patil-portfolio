import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';
export type Palette = 'crimson' | 'emerald' | 'navy';

const THEME_KEY = 'sp-theme';
const PALETTE_KEY = 'sp-palette';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getInitialPalette(): Palette {
  if (typeof window === 'undefined') return 'crimson';
  return (localStorage.getItem(PALETTE_KEY) as Palette) || 'crimson';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [palette, setPaletteState] = useState<Palette>(getInitialPalette);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p);
    localStorage.setItem(PALETTE_KEY, p);
    document.documentElement.setAttribute('data-palette', p);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-palette', palette);
  }, [theme, palette]);

  return { theme, palette, setTheme, setPalette, toggleTheme };
}
