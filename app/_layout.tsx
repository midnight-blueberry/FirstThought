import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from "styled-components/native";
import Header from '../components/ui/organisms/header';
import { defaultTheme, DefaultTheme } from '../theme';

export default function RootLayout() {
  const [theme, setTheme] = useState<DefaultTheme>(defaultTheme);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  if (!loaded) return null;

  const increaseFont = () => {
    setTheme(theme => ({
      ...theme,
      fontSizes: {
        small: theme.fontSizes.small + 2,
        medium: theme.fontSizes.medium + 2,
        large: theme.fontSizes.large + 2,
        xlarge: theme.fontSizes.xlarge + 2,
      },
    }));
  };

  const decreaseFont = () => {
    setTheme(theme => ({
      ...theme,
      fontSizes: {
        small: theme.fontSizes.small + 2,
        medium: theme.fontSizes.medium + 2,
        large: theme.fontSizes.large + 2,
        xlarge: theme.fontSizes.xlarge + 2,
      },
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <ThemeProvider theme={theme}>
            <Stack >
              <Stack.Screen
                name="index"
                options={{ header: () => <Header />}}
                initialParams={{
                  onIncreaseFont: increaseFont,
                  onDecreaseFont: decreaseFont
                }}
              />
            </Stack>
          </ThemeProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});