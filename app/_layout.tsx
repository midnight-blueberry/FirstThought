import { ThemeContext } from '@/src/theme/ThemeContext';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import * as Font from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from 'styled-components/native';
import Header from '../components/ui/organisms/header';
import { themes } from '../theme';

SplashScreen.preventAutoHideAsync();

function CustomDrawerContent(props: any) {
  const theme = useTheme(); 
  return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.spacing.medium,       // вместо “20”
          backgroundColor: theme.color.background, // если нужно
        }}
      >
          <DrawerItem
            label="Настройки"
            onPress={() => props.navigation.navigate('settings')}
            labelStyle={{
              fontFamily: 'MainFont',
              fontSize: theme.fontSize.medium,
              color: theme.color.primary,         // вместо props.theme.text
            }}
            style={{
              borderRadius: theme.borderRadius, // вместо “8”
              marginVertical: theme.spacing.small,  // вместо “4”
            }}
          />
        {/* … */}
      </DrawerContentScrollView>
    );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [theme, setTheme] = useState(themes[0]);

   useEffect(() => {
    async function prepare() {
      try {
        // 1. Загружаем шрифты
        await Font.loadAsync({
          'MainFont': require('@/assets/fonts/Comfortaa-VariableFont_wght.ttf'),
        });

        // 2. Здесь же можно загрузить любые другие ассеты
        // await Asset.loadAsync(...);

      } catch (e) {
        console.warn(e);
      } finally {
        // Даем понять, что всё готово
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // Возвращаем null, чтобы оставить нативный сплэш видимым
    return null;
  }


  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <SafeAreaView
            style={[styles.container, { backgroundColor: theme.color.background }]}
            edges={['top', 'bottom']}
            onLayout={onLayoutRootView}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer
                initialRouteName="home-page"
                // Здесь задаём общие опции для всех экранов и самого меню
                screenOptions={{
                  header: () => <Header />,

                  // ширина и фон «самого ящика»
                  drawerStyle: {
                    width: 280,
                    backgroundColor: theme.color.background,
                  },

                  // внутренняя обёртка контента (скролл + фон)
                  drawerContentStyle: {
                    paddingTop: 20,
                    backgroundColor: theme.color.background,
                  },

                  // стиль текста меток
                  drawerLabelStyle: {
                    fontFamily: 'MainFont',
                    fontSize: theme.fontSize.medium,
                    color: theme.color.primary,
                  },

                  // цвет активного/неактивного пункта
                  drawerActiveTintColor: theme.color.primary,
                  drawerInactiveTintColor: theme.color.primary,

                  // при желании: отступы вокруг каждого пункта
                  drawerItemStyle: {
                    marginVertical: 4,
                    marginHorizontal: 8,
                  },
                }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen name="home-page" />
                <Drawer.Screen name="settings" options={{ headerShown: false }} />
              </Drawer>
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