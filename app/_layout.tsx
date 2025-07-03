import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from "styled-components/native";
import Header from '../components/ui/organisms/header';
import { AppTheme, defaultTheme, ThemeContext } from '../theme';

// Собственный контент для бокового меню
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Настройки"
        onPress={() => props.navigation.navigate('settings')}
      />
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  const [theme, setTheme] = useState<AppTheme>(defaultTheme);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <ThemeProvider theme={theme}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer
                initialRouteName="home-page"
                screenOptions={{ header: () => <Header /> }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen name="home-page" />
                <Drawer.Screen name="settings" options={{ headerShown: false }} />
              </Drawer>
            </GestureHandlerRootView>
          </ThemeProvider>
        </ThemeContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});