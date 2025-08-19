import '@/src/polyfills/useInsertionEffectFallback';
import IconButton from '@/components/ui/atoms/icon-button';
import { fonts, getFontFamily } from '@/constants/Fonts';
import { loadSettings } from '@/src/storage/settings';
import { ThemeContext } from '@/src/theme/ThemeContext';
import type { DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import type { ParamListBase } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import * as Font from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme, ThemeProvider, useTheme } from 'styled-components/native';
import { themes } from '../theme';
import { buildTheme } from '@/src/theme/buildTheme';

void SplashScreen.preventAutoHideAsync();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.padding.medium,
          backgroundColor: theme.colors.background,
        }}
      >
          <DrawerItem
            label="Настройки"
            onPress={() => props.navigation.navigate('settings')}
            labelStyle={{
              fontFamily: theme.fontName,
              fontSize: theme.fontSize.medium,
              fontWeight: theme.fontWeight,
              color: theme.colors.basic,         // вместо props.theme.text
            }}
            style={{
              borderRadius: theme.borderRadius, // вместо “8”
              marginVertical: theme.margin.small,  // вместо “4”
            }}
          />
        {/* … */}
      </DrawerContentScrollView>
    );
}

type DrawerNavigatorProps = {
  theme: DefaultTheme;
  homePageHeaderTitle: string;
  homePageHeaderElevation: number;
  settingsPageHeaderTitle: string;
  settingsPageHeaderElevation: number;
};

function DrawerNavigator({
  theme,
  homePageHeaderTitle,
  homePageHeaderElevation,
  settingsPageHeaderTitle,
  settingsPageHeaderElevation,
}: DrawerNavigatorProps) {
  const { top } = useSafeAreaInsets();
  const headerHeight = top + theme.iconSize.medium + theme.padding.large * 2;
  const baseHeaderStyle = {
    height: headerHeight,
    backgroundColor: theme.colors.background,
  };

  return (
    <Drawer
      initialRouteName="home-page"
      // Здесь задаём общие опции для всех экранов и самого меню
      screenOptions={() => ({
        headerShown: true,

        // ширина и фон «самого ящика»
        drawerStyle: {
          marginTop: top,
          width: 280,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.basic,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          overflow: 'hidden',
        },

        // внутренняя обёртка контента (скролл + фон)
        drawerContentStyle: {
          paddingTop: 20,
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderColor: theme.colors.basic,
          borderWidth: theme.borderWidth.medium,
        },

        // стиль текста меток
        drawerLabelStyle: {
          fontFamily: theme.fontName,
          fontSize: theme.fontSize.medium,
          fontWeight: theme.fontWeight,
          color: theme.colors.basic,
        },

        // цвет активного/неактивного пункта
        drawerActiveTintColor: theme.colors.basic,
        drawerInactiveTintColor: theme.colors.disabled,

        // при желании: отступы вокруг каждого пункта
        drawerItemStyle: {
          marginVertical: theme.margin.small,
          marginHorizontal: theme.margin.medium,
        },

        // общие опции заголовков
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: theme.fontName,
          fontSize: theme.fontSize.large,
          color: theme.colors.basic,
          fontWeight: theme.fontWeight,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.basic,
        headerStyle: baseHeaderStyle,
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen
          name="home-page"
          options={({ navigation }: { navigation: DrawerNavigationProp<ParamListBase> }) => ({
          title: homePageHeaderTitle,
          headerLeft: () => (
            <IconButton
              icon="menu"
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
            />
          ),
          headerRight: () => (
            <IconButton icon="search" onPress={() => null} />
          ),
          headerStyle: {
            ...baseHeaderStyle,
            elevation: homePageHeaderElevation,
          },
        })}
      />
        <Drawer.Screen
          name="settings"
          options={({ navigation }: { navigation: DrawerNavigationProp<ParamListBase> }) => ({
          title: settingsPageHeaderTitle,
          headerLeft: () => (
            <IconButton
              icon="chevron-back"
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
          headerStyle: {
            ...baseHeaderStyle,
            elevation: settingsPageHeaderElevation,
          },
        })}
      />
    </Drawer>
  );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [theme, setTheme] = useState(themes.light);
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  useEffect(() => {
  async function prepare() {
    try {
      // 1. Шрифты (как и было)
      await Font.loadAsync(
        Object.fromEntries(
          fonts.flatMap((f) =>
            (f.weights as (keyof typeof f.files)[]).map((w) => [
              getFontFamily(f.family, w),
              f.files[w],
            ])
          )
        )
      );

      // 2. Настройки
      const saved = await loadSettings();

      // 3. Собираем тему из saved через общий хелпер
      setTheme(buildTheme(saved ?? undefined)); // <— единая точка сборки
    } catch (e) {
      console.warn(e);
    } finally {
      setAppIsReady(true);
    }
  }
  void prepare();
}, []);

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
              <DrawerNavigator
                theme={theme}
                homePageHeaderTitle={homePageHeaderTitle}
                homePageHeaderElevation={homePageHeaderElevation}
                settingsPageHeaderTitle={settingsPageHeaderTitle}
                settingsPageHeaderElevation={settingsPageHeaderElevation}
              />
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
