import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import useTheme from '@hooks/useTheme';

export default function ThemeHeaderBridge() {
  const navigation = useNavigation();
  const theme = useTheme();

  const setOptions = useCallback(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.headerBackground },
      headerTintColor: theme.colors.headerForeground,
      headerTitleStyle: { color: theme.colors.headerForeground },
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
