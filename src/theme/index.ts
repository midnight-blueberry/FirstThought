export { default as ThemeProvider } from './ThemeProvider';
export * from './buildTheme';
import type { DefaultTheme } from 'styled-components/native';

export type ThemeColorName = Exclude<keyof DefaultTheme['colors'], 'control'>;

export const getDisabledControlColor = (theme: DefaultTheme) =>
  theme.colors.control.disabled.fg;
