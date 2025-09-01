import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import useTheme from '@hooks/useTheme';
import { HeaderTitle } from '@components/ui/atoms';
import type { HeaderTitleProps } from '@react-navigation/elements';

export default function ThemeHeaderBridge() {
  const navigation = useNavigation();
  const theme = useTheme();

  const setOptions = useCallback(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.headerBackground },
      headerTintColor: theme.colors.headerForeground,
      headerTitle: (props: HeaderTitleProps) => <HeaderTitle {...props} />,
      headerTitleStyle: {
        color: theme.colors.headerForeground,
        fontStyle: theme.typography.header.headerTitleStyle,
        fontSize: theme.typography.header.headerTitleSize,
        letterSpacing: theme.typography.header.headerTitleLetterSpacing,
        lineHeight: theme.typography.header.headerTitleLineHeight,
      },
      headerLargeTitleStyle: Platform.select({
        ios: {
          color: theme.colors.headerForeground,
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
    }, [setOptions])
  );

  useEffect(() => {
    setOptions();
  }, [setOptions]);

  return null;
}
