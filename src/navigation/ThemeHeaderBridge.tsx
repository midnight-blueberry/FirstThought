import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';
import { resolveFontFace } from '@constants/fonts';
import type { FontFamily, FontWeight } from '@constants/fonts';

export default function ThemeHeaderBridge() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings } = useSettings();

  const setOptions = useCallback(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.headerBackground },
      headerTintColor: theme.colors.headerForeground,
        headerTitleStyle: {
          color: theme.colors.headerForeground,
          fontFamily: resolveFontFace(
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
            fontFamily: resolveFontFace(
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
  }, [navigation, theme, settings]);

  useFocusEffect(
    useCallback(() => {
      setOptions();
    }, [setOptions])
  );

  useEffect(() => {
    setOptions();
  }, [setOptions]);

  return null;
}
