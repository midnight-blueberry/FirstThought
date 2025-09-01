import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import useTheme from '@hooks/useTheme';
import { closestAvailableWeight, isVariableFamily } from '@constants/fonts';
import type { FontFamily, FontWeight } from '@constants/fonts';
import type { TextStyle } from 'react-native';

const fontStyle = (family: FontFamily, weight: FontWeight): TextStyle =>
  isVariableFamily(family)
    ? { fontFamily: family, fontWeight: String(weight) as TextStyle['fontWeight'] }
    : { fontFamily: `${family}-${closestAvailableWeight(family, weight)}` };

export default function ThemeHeaderBridge() {
  const navigation = useNavigation();
  const theme = useTheme();

  const setOptions = useCallback(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.headerBackground },
      headerTintColor: theme.colors.headerForeground,
      headerTitleStyle: {
        color: theme.colors.headerForeground,
        ...fontStyle(
          theme.typography.header.headerTitleFamily as FontFamily,
          theme.typography.header.headerTitleWeight as FontWeight,
        ),
        fontStyle: theme.typography.header.headerTitleStyle,
        fontSize: theme.typography.header.headerTitleSize,
        letterSpacing: theme.typography.header.headerTitleLetterSpacing,
        lineHeight: theme.typography.header.headerTitleLineHeight,
      },
      headerLargeTitleStyle: Platform.select({
        ios: {
          color: theme.colors.headerForeground,
          ...fontStyle(
            theme.typography.header.headerTitleFamily as FontFamily,
            theme.typography.header.headerLargeTitleWeight as FontWeight,
          ),
          fontStyle: theme.typography.header.headerTitleStyle,
          fontSize: theme.typography.header.headerLargeTitleSize,
          letterSpacing: theme.typography.header.headerLargeTitleLetterSpacing,
          lineHeight: theme.typography.header.headerLargeTitleLineHeight,
        },
      }),
    });
  }, [navigation, theme]);

  useFocusEffect(
    useCallback(() => {
      setOptions();
    }, [navigation, theme])
  );

  useEffect(() => {
    setOptions();
  }, [navigation, theme]);

  return null;
}
