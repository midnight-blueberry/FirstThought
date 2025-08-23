import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import { ThemeContext } from '@store/ThemeContext';
import { useAppBootstrap } from '@hooks/useAppBootstrap';
import { PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from 'styled-components/native';
import DrawerNavigator from '@components/navigation/DrawerNavigator';
import { themes } from '@constants/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready: appIsReady, theme, setTheme } = useAppBootstrap();
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      void SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Возвращаем null, чтобы оставить нативный сплэш видимым
    return null;
  }

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
