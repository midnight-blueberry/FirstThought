import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';

export default function useSyncHeaderTheme() {
  const navigation = useNavigation();
  const { settings } = useSettings();
  const { colors } = useTheme();

  const headerTint = (colors as any).headerTint ?? colors.headerForeground;
  const headerTitle = (colors as any).headerTitle ?? colors.headerForeground;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.headerBackground },
      headerTintColor: headerTint,
      headerTitleStyle: { color: headerTitle },
    });
  }, [navigation, settings.themeId, colors.headerBackground, headerTint, headerTitle]);
}

