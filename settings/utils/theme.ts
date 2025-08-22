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
