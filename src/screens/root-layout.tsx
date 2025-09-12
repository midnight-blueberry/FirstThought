import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SettingsProvider } from '@/state/SettingsContext';
import ThemeProvider from '@theme/ThemeProvider';
import useTheme from '@hooks/useTheme';
import { PortalProvider } from 'react-native-portalize';
import { OverlayTransitionProvider } from '@components/settings/overlay/OverlayTransition';
import { FONT_FILES } from '@/constants/fonts/files';
import DrawerNavigator from '../navigation/DrawerNavigator';
import StatusBarBackground from '@components/ui/StatusBarBackground';
import { SaveIndicatorProvider } from '@components/header/SaveIndicator';

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
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  const onLayoutRootView = useCallback(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <StatusBarBackground />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        onLayout={onLayoutRootView}
        edges={['left', 'right', 'bottom']}
      >
        <DrawerNavigator theme={theme} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
