// src/theme/buildTheme.ts
import { defaultFontName, fonts, getFontFamily } from '@/constants/Fonts';
import { themeList, themes } from '@/theme';
import { DefaultTheme } from 'styled-components/native';

type SavedSettings = {
  themeName?: string;
  accentColor?: string;
  fontName?: string;            // имя из твоего списка шрифтов (fonts[n].name)
  fontWeight?: DefaultTheme['fontWeight']; // '400' | '700' и т.п.
  fontSizeLevel?: number;       // твоя шкала (например 1..5), 3 = базовый
  iconSize?: DefaultTheme['iconSize']; // если пользователь прямо задаёт набор размеров
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
  const weight =
    (saved?.fontWeight as DefaultTheme['fontWeight']) ??
    (fontMeta.defaultWeight as DefaultTheme['fontWeight']);

  // 3) Размеры шрифта (с учётом уровня)
  // В твоём коде: delta = (level - 3) * 2; medium = font.defaultSize + delta
  const level = saved?.fontSizeLevel ?? 3;
  const delta = (level - 3) * 2;
  const medium = fontMeta.defaultSize + delta;
  const updatedFontSize: DefaultTheme['fontSize'] = {
    small: medium - 4,
    medium,
    large: medium + 4,
    xlarge: medium + 8,
  };

  // 4) Размеры иконок
  // Если пользователь уже сохранил iconSize — уважаем его; иначе считаем от level
  const iconDelta = (level - 3) * 4;
  const updatedIconSize: DefaultTheme['iconSize'] =
    saved?.iconSize ?? {
      xsmall: sizes.iconSize.xsmall + iconDelta,
      small: sizes.iconSize.small + iconDelta,
      medium: sizes.iconSize.medium + iconDelta,
      large: sizes.iconSize.large + iconDelta,
      xlarge: sizes.iconSize.xlarge + iconDelta,
    };

  // 5) Финальный объект темы
  return {
    ...chosenTheme,
    colors: updatedColors,
    fontSize: updatedFontSize,
    iconSize: updatedIconSize,
    fontName: getFontFamily(fontMeta.family, weight as string),
    fontWeight: weight,
  } as DefaultTheme;
}
