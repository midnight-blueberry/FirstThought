/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { ColorTokens } from '@/theme/colors';
import type { ThemeName } from '@/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof ColorTokens,
) {
  const colorScheme = useColorScheme();
  const theme: ThemeName = colorScheme ?? 'light';
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
