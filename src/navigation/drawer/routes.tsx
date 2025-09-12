import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { IconButton } from '@components/ui/atoms';
import SaveIndicator from '@components/header/SaveIndicator';
import type { DefaultTheme } from 'styled-components/native';
import HomePageScreen from '@screens/home-page';
import SettingsScreen from '@screens/settings';
import { DrawerIcon } from '@/navigation/ui/DrawerIcon';

export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
};

type DrawerRoutesConfig = {
  theme: DefaultTheme;
  baseHeaderStyle: Record<string, unknown>;
  homePageHeaderTitle: string;
  homePageHeaderElevation: number;
  settingsPageHeaderTitle: string;
  settingsPageHeaderElevation: number;
};

export const drawerRoutes = ({
  theme,
  baseHeaderStyle,
  homePageHeaderTitle,
  homePageHeaderElevation,
  settingsPageHeaderTitle,
  settingsPageHeaderElevation,
}: DrawerRoutesConfig) =>
  [
    {
      name: 'Home' as const,
      component: HomePageScreen,
      options: ({ navigation }: DrawerScreenProps<DrawerParamList, 'Home'>) => ({
        title: homePageHeaderTitle,
        drawerIcon: DrawerIcon('home'),
        headerLeft: () => (
          <IconButton
            icon="menu"
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
          />
        ),
        headerRight: () => <IconButton icon="search" onPress={() => null} />,
        headerStyle: {
          ...baseHeaderStyle,
          elevation: homePageHeaderElevation,
        },
        headerTintColor: theme.colors.headerForeground,
      }),
    },
    {
      name: 'Settings' as const,
      component: SettingsScreen,
      options: ({ navigation }: DrawerScreenProps<DrawerParamList, 'Settings'>) => ({
        title: settingsPageHeaderTitle,
        drawerIcon: DrawerIcon('settings'),
        headerLeft: () => (
          <IconButton
            icon="chevron-back"
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
        headerRight: () => <SaveIndicator />,
        headerStyle: {
          ...baseHeaderStyle,
          elevation: settingsPageHeaderElevation,
        },
        headerTintColor: theme.colors.headerForeground,
      }),
    },
  ] as const;
