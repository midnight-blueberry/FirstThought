import React from 'react';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import type { DefaultTheme } from 'styled-components/native';

export default function useHeaderTitleSync(theme: DefaultTheme, headerRight?: () => React.ReactNode) {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.basic,
      headerTitleStyle: {
        color: theme.colors.basic,
        fontFamily: theme.fontName,
        fontWeight: theme.fontWeight,
        fontSize: theme.fontSize.large,
      },
      headerRight,
    });
  }, [navigation, theme, headerRight]);
}
