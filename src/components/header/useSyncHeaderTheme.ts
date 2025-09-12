import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';

export default function useSyncHeaderTheme() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings } = useSettings();

  const { headerBackground, headerForeground } = theme.colors;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: headerBackground },
      headerTintColor: headerForeground,
      headerTitleStyle: { color: headerForeground },
    });
  }, [navigation, settings.themeId, headerBackground, headerForeground]);
}

