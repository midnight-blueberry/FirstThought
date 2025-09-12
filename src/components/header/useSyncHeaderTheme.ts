import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';

export default function useSyncHeaderTheme() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings } = useSettings();
  const { colors } = theme;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.headerBackground },
      headerTintColor: colors.headerTint,
      headerTitleStyle: { color: colors.headerTitle },
    });
  }, [navigation, settings.themeId, colors.headerBackground, colors.headerTint, colors.headerTitle]);
}
