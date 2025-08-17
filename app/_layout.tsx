import IconButton from '@/components/ui/atoms/icon-button';
import { defaultFontName, fonts, getFontFamily } from '@/constants/Fonts';
import { loadSettings } from '@/src/storage/settings';
import { ThemeContext } from '@/src/theme/ThemeContext';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme, ThemeProvider, useTheme } from 'styled-components/native';
import { themeList, themes } from '../theme';

void SplashScreen.preventAutoHideAsync();

function getStatusBarHeight() {
  const { top } = useSafeAreaInsets(); // логические px (dp)
  return top; // это и есть высота статус-бара/выреза
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  return (
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: theme.spacing.medium,
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
              marginVertical: theme.spacing.small,  // вместо “4”
            }}
          />
        {/* … */}
      </DrawerContentScrollView>
    );
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [theme, setTheme] = useState(themes.light);
  const [homePageHeaderTitle, setHomePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation, setHomePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle, setSettingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation, setSettingsPageHeaderElevation] = useState(0);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Загружаем шрифты
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

        // 2. Загружаем сохраненные настройки
        const saved = await loadSettings();
        const fontName = saved?.fontName ?? defaultFontName;
        const font = fonts.find(f => f.name === fontName) ?? fonts[0];
        const weight: TextStyle['fontWeight'] =
          (saved?.fontWeight as TextStyle['fontWeight']) ??
          (font.defaultWeight as TextStyle['fontWeight']);
        const chosenTheme = saved
          ? themeList.find(t => t.name === saved.themeName) ?? themes.light
          : themes.light;
        const accentColor = saved?.accentColor ?? chosenTheme.colors.accent;
        const updatedColors = { ...chosenTheme.colors, accent: accentColor };
        if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
          updatedColors.basic = accentColor;
        }
        const delta = saved ? (saved.fontSizeLevel - 3) * 2 : 0;
        const medium = font.defaultSize + delta;
        const updatedFontSize = {
          small: medium - 4,
          medium,
          large: medium + 4,
          xlarge: medium + 8,
        } as DefaultTheme['fontSize'];
        setTheme({
          ...chosenTheme,
          colors: updatedColors,
          fontSize: updatedFontSize,
          fontName: getFontFamily(font.family, weight as string),
          fontWeight: weight,
        });

        // 3. Здесь же можно загрузить любые другие ассеты
        // await Asset.loadAsync(...);

      } catch (e) {
        console.warn(e);
      } finally {
        // Даем понять, что всё готово
        setAppIsReady(true);
      }
    }

    void prepare();
  }, []);

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
        <SafeAreaProvider>
          <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            onLayout={onLayoutRootView}
            edges={['left', 'right', 'bottom']}
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Drawer
                initialRouteName="home-page"
                // Здесь задаём общие опции для всех экранов и самого меню
                screenOptions={{
                  headerShown: true,

                  // ширина и фон «самого ящика»
                  drawerStyle: {
                    marginTop: getStatusBarHeight(),
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
                  drawerInactiveTintColor: theme.colors.basic,

                  // при желании: отступы вокруг каждого пункта
                  drawerItemStyle: {
                    marginVertical: 4,
                    marginHorizontal: 8,
                  },
                }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
              >
                <Drawer.Screen
                  name="home-page"
                  options={{
                    title: homePageHeaderTitle,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                      fontFamily: theme.fontName,
                      fontSize: theme.fontSize.large,
                      color: theme.colors.basic,
                      fontWeight: theme.fontWeight,
                    },
                    headerStyle: {
                      backgroundColor: theme.colors.background,
                      elevation: homePageHeaderElevation,
                    },
                    // iOS/web (React Navigation 6) — отключает линию под хедером
                    headerShadowVisible: false,
                    headerTintColor: theme.colors.basic, // цвет иконок/стрелки «назад»
                    headerLeft: () => {
                      const navigation = useNavigation();
                      return (
                        <IconButton
                          icon="menu"
                          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        />
                      )
                    },
                    headerRight: () => {
                      const navigation = useNavigation();
                      return (
                      <IconButton
                        icon="search"
                        onPress={() => null}
                      />
                      )
                    },
                  }}
                />
                <Drawer.Screen
                  name="settings"
                  options={{
                    title: settingsPageHeaderTitle,
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                      fontFamily: theme.fontName,
                      fontSize: theme.fontSize.large,
                      color: theme.colors.basic,
                      fontWeight: theme.fontWeight,
                    },
                    headerStyle: {
                      backgroundColor: theme.colors.background,
                      elevation: homePageHeaderElevation,
                    },
                    headerShadowVisible: false,
                    headerTintColor: theme.colors.basic, // цвет иконок/стрелки «назад»
                    headerLeft: () => {
                      const navigation = useNavigation();
                      return (
                        <IconButton
                          icon="chevron-back"
                          onPress={() => navigation.goBack()}
                        />
                      )
                    },
                  }}
                />
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
