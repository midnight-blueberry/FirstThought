import { DefaultTheme } from 'styled-components/native';
import { sizes } from './tokens';
import { lightColors, darkColors } from './colors';

const createTheme = (name: string, colors: typeof lightColors): DefaultTheme => ({
  name,
  colors,
  ...sizes,
});

export const lightTheme: DefaultTheme = createTheme('Светлая', lightColors);
export const darkTheme: DefaultTheme = createTheme('Темная', darkColors);

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export const themeList = Object.values(themes);

export type Theme = typeof lightTheme;
export type ThemeName = keyof typeof themes;
