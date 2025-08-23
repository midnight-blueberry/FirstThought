import 'react-native-gesture-handler';
import 'react-native-reanimated';
import '@/src/fixUseInsertionEffect';
import IconButton from '@/components/ui/atoms/icon-button';
import { ThemeContext } from '@/src/theme/ThemeContext';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';
import type { DrawerContentComponentProps, DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import type { ParamListBase } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme, useTheme } from 'styled-components/native';
import AppProviders from '@/src/app/AppProviders';

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
            onPress={() => props.navigation.navigate('settings/index')}
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
          name="settings/index"
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
  const { ready: appIsReady, theme, setTheme } = useAppBootstrap();
  const [homePageHeaderTitle] = useState(() => 'Мои дневники');
  const [homePageHeaderElevation] = useState(0);
  const [settingsPageHeaderTitle] = useState(() => 'Настройки');
  const [settingsPageHeaderElevation] = useState(0);

  if (!appIsReady) {
    // Возвращаем null, чтобы оставить нативный сплэш видимым
    return null;
  }

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      <AppProviders theme={theme}>
        <DrawerNavigator
          theme={theme}
          homePageHeaderTitle={homePageHeaderTitle}
          homePageHeaderElevation={homePageHeaderElevation}
          settingsPageHeaderTitle={settingsPageHeaderTitle}
          settingsPageHeaderElevation={settingsPageHeaderElevation}
        />
      </AppProviders>
    </ThemeContext.Provider>
  );
}
