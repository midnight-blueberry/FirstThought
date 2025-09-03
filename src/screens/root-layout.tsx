import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import { PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SettingsProvider } from '@/state/SettingsContext';
import ThemeProvider from '@theme/ThemeProvider';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';
import { FONT_FILES } from '@/constants/fonts/files';
import DrawerNavigator from '../navigation/DrawerNavigator';
import StatusBarOverlay from '@components/ui/atoms/status-bar-overlay';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const entries = Object.entries(FONT_FILES).flatMap(([family, map]) =>
    Object.entries(map).map(([w, file]) => [`${family}-${w}`, file] as const),
  );
  const fontsObject = Object.fromEntries(entries);

  const [loaded] = useFonts(fontsObject);

  if (!loaded) {
    return null;
  }
  return (
    <SettingsProvider>
      <ThemeProvider>
        <RootContent />
      </ThemeProvider>
    </SettingsProvider>
  );
}

function RootContent() {
  const theme = useTheme();
  const { settings } = useSettings();
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  const onLayoutRootView = useCallback(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background, position: 'relative' }]}
        onLayout={onLayoutRootView}
        edges={Platform.OS === 'ios' ? ['top', 'right', 'bottom', 'left'] : ['right', 'bottom', 'left']}
      >
        <StatusBar translucent style={theme.isDark ? 'light' : 'dark'} />
        <StatusBarOverlay />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PortalProvider>
            <DrawerNavigator
              key={`ui-${settings.themeId}-${theme.colors.headerBackground}`}
              theme={theme}
              homePageHeaderTitle={homePageHeaderTitle}
              homePageHeaderElevation={homePageHeaderElevation}
              settingsPageHeaderTitle={settingsPageHeaderTitle}
              settingsPageHeaderElevation={settingsPageHeaderElevation}
            />
          </PortalProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
