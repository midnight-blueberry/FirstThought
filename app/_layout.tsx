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
import { AppColors, ColorsContext, themes } from '../theme';

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
  const [colors, setColors] = useState<AppColors>(themes[0]);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <ColorsContext.Provider value={{ colors, setColors }}>
          <ThemeProvider theme={colors}>
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
        </ColorsContext.Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});