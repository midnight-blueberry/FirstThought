// src/theme/buildTheme.ts
import { defaultFontName, fonts, getFontFamily } from '@/constants/Fonts';
import { themeList, themes } from '@/theme';
import { sizes } from '@/theme/tokens';
import { DefaultTheme } from 'styled-components/native';
import { nextIconSize } from '@/app/settings/utils/font';
import { clampLevel } from '@/app/settings/utils/theme';

type SavedSettings = {
  themeName?: string;
  accentColor?: string;
  fontName?: string;            // имя из твоего списка шрифтов (fonts[n].name)
  fontWeight?: DefaultTheme['fontWeight']; // '400' | '700' и т.п.
  fontSizeLevel?: number;       // твоя шкала (например 1..5), 3 = базовый
  iconSize?: DefaultTheme['iconSize']; // если пользователь прямо задаёт набор размеров
  noteTextAlign?: DefaultTheme['noteTextAlign'];
} | undefined;

export function buildTheme(saved: SavedSettings): DefaultTheme {
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
  const fontMeta = fonts.find(f => f.name === savedFontName) ?? fonts[0];
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

  // 6) Финальный объект темы
  return {
    ...chosenTheme,
    colors: updatedColors,
    fontSize: updatedFontSize,
    padding: updatedPadding,
    margin: updatedMargin,
    iconSize: updatedIconSize,
    fontName: getFontFamily(fontMeta.family, String(weight)),
    fontWeight: weight,
    noteTextAlign: saved?.noteTextAlign ?? chosenTheme.noteTextAlign,
  } as DefaultTheme;
}
