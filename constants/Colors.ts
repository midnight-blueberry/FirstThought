import { themes, ThemeName } from './theme';
import type { ColorTokens } from './theme/colors';

export const Colors: Record<ThemeName, ColorTokens> = {
  light: themes.light.colors,
  cream: themes.cream.colors,
  dark: themes.dark.colors,
};
