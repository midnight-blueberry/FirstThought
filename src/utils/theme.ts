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

export function getDisabledColor(
  theme: { isDark?: boolean },
  type: 'icon' | 'fill' = 'icon',
): string {
  if (theme.isDark) {
    return type === 'fill' ? '#5A5A5A' : 'rgba(255,255,255,0.32)';
  }
  return type === 'fill' ? '#C8C8C8' : 'rgba(0,0,0,0.28)';
}
