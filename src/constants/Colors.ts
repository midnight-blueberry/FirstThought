import { themes, ThemeName } from '@theme/buildTheme';
import type { ColorTokens } from '@constants/theme/colors';

export const Colors: Record<ThemeName, ColorTokens> = {
  light: themes.light.colors,
  cream: themes.cream.colors,
  dark: themes.dark.colors,
};
