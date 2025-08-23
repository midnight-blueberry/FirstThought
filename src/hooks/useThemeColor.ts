/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from '@hooks/useColorScheme';
import { themes, type ThemeName } from '@theme/buildTheme';
import type { ColorTokens } from '@constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ColorTokens,
) {
  const colorScheme = useColorScheme();
  const theme: ThemeName = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? themes[theme].colors[colorName];
}
