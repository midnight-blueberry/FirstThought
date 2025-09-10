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

import type { DefaultTheme } from 'styled-components/native';

// Returns appropriate color for disabled icon/border depending on theme.
// If `solid` is true, a solid fill color is returned instead of translucent tint.
export function getDisabledColor(
  theme: DefaultTheme,
  solid = false,
): string {
  if (theme.isDark) {
    return solid ? '#5A5A5A' : 'rgba(255,255,255,0.32)';
  }
  return solid ? '#C8C8C8' : 'rgba(0,0,0,0.28)';
}
