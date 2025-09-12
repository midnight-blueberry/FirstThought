import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SettingsProvider } from '@/state/SettingsContext';
import ThemeProvider from '@theme/ThemeProvider';
import useTheme from '@hooks/useTheme';
import { useSettings } from '@/state/SettingsContext';
import { PortalProvider } from 'react-native-portalize';
import { OverlayTransitionProvider } from '@components/settings/overlay/OverlayTransition';
import { FONT_FILES } from '@/constants/fonts/files';
import DrawerNavigator from '../navigation/DrawerNavigator';
import StatusBarUnderlay from '@components/header/StatusBarUnderlay';
import { SaveIndicatorProvider } from '@components/header/SaveIndicator';

void SystemUI.setBackgroundColorAsync('transparent');
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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PortalProvider>
            <OverlayTransitionProvider>
              <SaveIndicatorProvider>
                <RootContent />
              </SaveIndicatorProvider>
            </OverlayTransitionProvider>
          </PortalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SettingsProvider>
  );
}

function RootContent() {
  const theme = useTheme();
  const { settings: _settings } = useSettings();
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  const onLayoutRootView = useCallback(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        translucent
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />
      <StatusBarUnderlay />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        onLayout={onLayoutRootView}
        edges={['left', 'right', 'bottom']}
      >
        <DrawerNavigator
          theme={theme}
          homePageHeaderTitle={homePageHeaderTitle}
          homePageHeaderElevation={homePageHeaderElevation}
          settingsPageHeaderTitle={settingsPageHeaderTitle}
          settingsPageHeaderElevation={settingsPageHeaderElevation}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
