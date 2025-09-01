// src/theme/buildTheme.ts
import { defaultFontName, fonts, resolveFontFace } from '@constants/fonts';
import { headerTypography } from './tokens/typography';
import { getFontByName } from '@utils/fontHelpers';
import {
  lightColors,
  creamColors,
  darkColors,
  type ColorTokens,
  sizes,
} from '@constants/theme';
import { DefaultTheme } from 'styled-components/native';
import { nextIconSize } from '@utils/font';
import { clampLevel } from '@utils/theme';
import type { SavedSettings } from '@types';
import { fontKey } from '@constants/fonts/resolve';

const createTheme = (name: string, colors: ColorTokens): DefaultTheme => ({
  name,
  colors,
  ...sizes,
    fontName: fontKey(defaultFontName.replace(/ /g, '_'), 500),
  fontWeight: '500',
  noteTextAlign: 'left',
  barStyle: name === 'Темная' ? 'light-content' : 'dark-content',
  isDark: name === 'Темная',
  headerShadowVisible: false,
  typography: { header: headerTypography },
});

export const themes = {
  light: createTheme('Светлая', lightColors),
  cream: createTheme('Кремовая', creamColors),
  dark: createTheme('Темная', darkColors),
} as const;

export type Theme = (typeof themes)['light'];
export type ThemeName = keyof typeof themes;

export const themeList: Theme[] = Object.values(themes);

export function buildTheme(saved?: SavedSettings): DefaultTheme {
  // 1) Тема + акцент
  const chosenTheme = saved
    ? themeList.find(t => t.name === saved.themeName) ?? themes.light
    : themes.light;

  const accentColor = saved?.accentColor ?? chosenTheme.colors.accent;
  const updatedColors = { ...chosenTheme.colors, accent: accentColor };
  if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
    updatedColors.basic = accentColor;
  }

  // 2) Шрифт (семейство + начертание)
  const savedFontName = saved?.fontName ?? defaultFontName;
  const fontMeta = getFontByName(fonts, savedFontName);
  const weight: DefaultTheme['fontWeight'] =
    saved?.fontWeight ?? (fontMeta.defaultWeight as DefaultTheme['fontWeight']);

  // 3) Размеры шрифта (с учётом уровня)
  // В твоём коде: delta = (level - 3) * 2; medium = font.defaultSize + delta
  const level = clampLevel(saved?.fontSizeLevel ?? 3);
  const delta = (level - 3) * 2;
  const medium = fontMeta.defaultSize + delta;
  const updatedFontSize: DefaultTheme['fontSize'] = {
    small: medium - 4,
    medium,
    large: medium + 4,
    xlarge: medium + 8,
  };

  // 4) Отступы (margin и padding)
  const spacingDelta = level - 3;
  const updatedPadding: DefaultTheme['padding'] = {
    small: sizes.padding.small + spacingDelta,
    medium: sizes.padding.medium + spacingDelta,
    large: sizes.padding.large + spacingDelta,
    xlarge: sizes.padding.xlarge + spacingDelta,
  };

  const updatedMargin: DefaultTheme['margin'] = {
    small: sizes.margin.small + spacingDelta,
    medium: sizes.margin.medium + spacingDelta,
    large: sizes.margin.large + spacingDelta,
    xlarge: sizes.margin.xlarge + spacingDelta,
  };

  // 5) Размеры иконок
  // Если пользователь уже сохранил iconSize — уважаем его; иначе считаем от level
  const updatedIconSize: DefaultTheme['iconSize'] =
    saved?.iconSize ?? nextIconSize(level, sizes.iconSize);

  // 6) Типографика для заголовков
  const resolved = resolveFontFace(savedFontName, weight, 'normal');
  const header = {
    ...headerTypography,
    headerTitleFamily: resolved.fontFamily,
    headerTitleWeight: resolved.fontWeight,
    headerTitleStyle: 'normal' as const,
    headerTitleSize: updatedFontSize.large,
    headerTitleLetterSpacing: 0,
    headerTitleLineHeight: updatedFontSize.large + 6,
    headerLargeTitleSize: updatedFontSize.xlarge,
    headerLargeTitleWeight: resolved.fontWeight,
    headerLargeTitleLetterSpacing: 0,
    headerLargeTitleLineHeight: updatedFontSize.xlarge + 6,
  };

  // 7) Финальный объект темы
  return {
    ...chosenTheme,
    colors: updatedColors,
    fontSize: updatedFontSize,
    padding: updatedPadding,
    margin: updatedMargin,
    iconSize: updatedIconSize,
    fontName: resolved.fontFamily,
    fontWeight: resolved.fontWeight,
    noteTextAlign: saved?.noteTextAlign ?? chosenTheme.noteTextAlign,
    typography: { header },
  } as DefaultTheme;
}

