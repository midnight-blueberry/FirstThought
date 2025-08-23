/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@config/Colors';
import { useColorScheme } from '@hooks/useColorScheme';
import type { ColorTokens } from '@config/theme/colors';
import type { ThemeName } from '@config/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ColorTokens,
) {
  const colorScheme = useColorScheme();
  const theme: ThemeName = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
