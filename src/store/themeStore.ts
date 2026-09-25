import { useState, useEffect } from 'react';
import { BOARD_THEMES } from '../themes/boardThemes';
import type { BoardThemeId, PaperStyleId } from '../types/canvas';
import { toolStore } from './toolStore';

export interface ThemeState {
  themeId: BoardThemeId;
  paperStyle: PaperStyleId;
  customBgColor?: string;
  isDark: boolean;
}

class ThemeStore {
  private state: ThemeState = {
    themeId: 'cream',
    paperStyle: 'grid',
    isDark: false,
  };

  private listeners = new Set<() => void>();

  getState(): ThemeState {
    return this.state;
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setTheme(themeId: BoardThemeId) {
    const theme = BOARD_THEMES[themeId] || BOARD_THEMES.cream;
    this.state.themeId = themeId;
    this.state.isDark = theme.isDark;

    // Adapt active pen ink colors for contrast
    toolStore.setPenColor(theme.defaultInkColor);

    this.emit();
  }

  setPaperStyle(style: PaperStyleId) {
    this.state.paperStyle = style;
    this.emit();
  }

  setCustomBgColor(color: string) {
    this.state.customBgColor = color;
    this.emit();
  }
}

export const themeStore = new ThemeStore();

export function useThemeStore(): ThemeState {
  const [state, setState] = useState(() => themeStore.getState());

  useEffect(() => {
    return themeStore.subscribe(() => {
      setState({ ...themeStore.getState() });
    });
  }, []);

  return state;
}
