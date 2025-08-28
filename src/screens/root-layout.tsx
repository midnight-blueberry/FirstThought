import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import { useAppBootstrap } from '@hooks/useAppBootstrap';
import { PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import DrawerNavigator from '../navigation/DrawerNavigator';
import ThemeProvider from '@theme/ThemeProvider';
import useTheme from '@hooks/useTheme';
import { themes } from '@theme/buildTheme';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready: appIsReady, initialSettings } = useAppBootstrap();

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      void SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider initial={initialSettings}>
      <AppContent onLayoutRootView={onLayoutRootView} />
    </ThemeProvider>
  );
}

function AppContent({ onLayoutRootView }: { onLayoutRootView: () => void }) {
  const theme = useTheme();
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <>
      <StatusBar style={theme.name === themes.dark.name ? 'light' : 'dark'} />
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          onLayout={onLayoutRootView}
          edges={['left', 'right', 'bottom']}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider>
              <DrawerNavigator
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
