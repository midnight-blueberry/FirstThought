import type { DefaultTheme } from 'styled-components/native';

type ThemeWithBackground = {
  name: string;
  colors: { background: string };
};

export function resolveOverlayColor(themeName: string, themeList: ThemeWithBackground[]): string | undefined {
  return themeList.find(t => t.name === themeName)?.colors.background;
}

export function clampLevel(n: number, min = 1, max = 5): number {
  return Math.min(Math.max(n, min), max);
}

export function getDisabledColor(theme: DefaultTheme, solid = false): string {
  if (solid) {
    return theme.isDark ? '#5A5A5A' : '#C8C8C8';
  }
  return theme.isDark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.28)';
}
