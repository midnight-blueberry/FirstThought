import React from 'react';
import { DrawerActions } from '@react-navigation/native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import HomePageScreen from '@screens/home-page';
import SettingsScreen from '@screens/settings';
import { IconButton } from '@components/ui/atoms';
import SaveIndicator from '@components/header/SaveIndicator';
import { DrawerIcon } from '../ui/DrawerIcon';

export type DrawerParamList = {
  Home: undefined;
  Settings: undefined;
};

export const drawerRoutes = [
  {
    name: 'Home',
    component: HomePageScreen,
    options: ({ navigation }: DrawerScreenProps<DrawerParamList, 'Home'>) => ({
      title: 'Мои дневники',
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
    }),
  },
  {
    name: 'Settings',
    component: SettingsScreen,
    options: ({ navigation }: DrawerScreenProps<DrawerParamList, 'Settings'>) => ({
      title: 'Настройки',
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
    }),
  },
] as const;

