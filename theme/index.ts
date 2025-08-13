import { DefaultTheme } from 'styled-components/native';
import { sizes } from './tokens';
import { lightColors, darkColors, creamColors, ColorTokens } from './colors';

const createTheme = (name: string, colors: ColorTokens): DefaultTheme => ({
  name,
  colors,
  ...sizes,
});

export const lightTheme: DefaultTheme = createTheme('Светлая', lightColors);
export const darkTheme: DefaultTheme = createTheme('Темная', darkColors);
export const creamTheme: DefaultTheme = createTheme('Кремовая', creamColors);

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  cream: creamTheme,
} as const;

export type Theme = typeof lightTheme;
export type ThemeName = keyof typeof themes;

export const themeList: Theme[] = Object.values(themes);
