import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@utils/fixUseInsertionEffect';
import { useAppBootstrap } from '@hooks/useAppBootstrap';
import { PortalProvider } from '@gorhom/portal';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SettingsProvider } from '@/state/SettingsContext';
import ThemeProvider from '@theme/ThemeProvider';
import useTheme from '@hooks/useTheme';
import DrawerNavigator from '../navigation/DrawerNavigator';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready: appIsReady } = useAppBootstrap();
  if (!appIsReady) {
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
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.headerBackground}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        onLayout={onLayoutRootView}
        edges={['left', 'right', 'bottom']}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PortalProvider>
            <DrawerNavigator
              key={theme.name}
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
