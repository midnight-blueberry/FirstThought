export type IconSizeToken = {
  xsmall: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
};

import { clampLevel } from './theme';

export function getBaseFontName(themeFontName: string): string {
  return themeFontName
    .replace(/-\d+(?:-italic)?$/, '')
    .replace(/_/g, ' ');
}

export function toFamilyKey(name: string): string {
  return name
    .replace(/-\d+(?:-italic)?$/, '')
    .replace(/ /g, '');
}

export function calcFontSizeLevel(themeSmallPx: number, fontDefaultSize: number): 1|2|3|4|5 {
  const base = fontDefaultSize - 4;
  const level = Math.round((themeSmallPx - base) / 2) + 3;
  return clampLevel(level) as 1|2|3|4|5;
}

export function nextIconSize(level: number, sizes: IconSizeToken): IconSizeToken {
  const iconDelta = (level - 3) * 4;
  return {
    xsmall: sizes.xsmall + iconDelta,
    small: sizes.small + iconDelta,
    medium: sizes.medium + iconDelta,
    large: sizes.large + iconDelta,
    xlarge: sizes.xlarge + iconDelta,
  };
}
