import { DefaultTheme } from 'styled-components/native';
import { sizes } from './tokens';
import { lightColors, creamColors, darkColors, ColorTokens } from './colors';
import { defaultFontName, getFontFamily } from '@/constants/Fonts';

const createTheme = (name: string, colors: ColorTokens): DefaultTheme => ({
  name,
  colors,
  ...sizes,
  fontName: getFontFamily(defaultFontName.replace(/ /g, '_'), '500'),
  fontWeight: '500',
  noteTextAlign: 'left',
});

export const lightTheme: DefaultTheme = createTheme('Светлая', lightColors);
export const creamTheme: DefaultTheme = createTheme('Кремовая', creamColors);
export const darkTheme: DefaultTheme = createTheme('Темная', darkColors);

export const themes = {
  light: lightTheme,
  cream: creamTheme,
  dark: darkTheme,
} as const;

export type Theme = typeof lightTheme;
export type ThemeName = keyof typeof themes;

export const themeList: Theme[] = Object.values(themes);
