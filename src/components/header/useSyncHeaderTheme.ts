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
    navigation.setOptions((prev: any) => ({
      headerStyle: {
        ...(prev?.headerStyle as object),
        backgroundColor: colors.headerBackground,
      },
      headerTintColor: colors.headerForeground,
      headerTitleStyle: {
        ...(prev?.headerTitleStyle as object),
        color: colors.headerForeground,
      },
    }));
  }, [navigation, settings.themeId, colors.headerBackground, colors.headerForeground]);
}
