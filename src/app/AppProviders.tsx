import React, { useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider } from '@gorhom/portal';
import { DefaultTheme, ThemeProvider } from 'styled-components/native';
import { StyleSheet } from 'react-native';
import { themes } from '@/theme';

export type AppProvidersProps = {
  theme: DefaultTheme;
  children: React.ReactNode;
};

export default function AppProviders({ theme, children }: AppProvidersProps) {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  const onLayoutRootView = useCallback(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StatusBar style={theme.name === themes.dark.name ? 'light' : 'dark'} />
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          edges={['left', 'right', 'bottom']}
          onLayout={onLayoutRootView}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider>{children}</PortalProvider>
          </GestureHandlerRootView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
