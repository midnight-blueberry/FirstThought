import React, { useMemo } from 'react';
import { Dimensions, Platform } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme } from 'styled-components/native';
import { IconButton, HeaderTitle } from '@components/ui/atoms';
import type { HeaderTitleProps } from '@react-navigation/elements';
import useHeaderConfig from '@hooks/useHeaderConfig';
import HomePageScreen from '@screens/home-page';
import SettingsScreen from '@screens/settings';
import SaveIndicator from '@components/header/SaveIndicator';

import CustomDrawerContent from '@/navigation/CustomDrawerContent';
import { DrawerIcon } from './ui/DrawerIcon';
import { defaultDrawerScreenOptions } from './options/drawerOptions';
import type { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

type Props = {
  theme: DefaultTheme;
  homePageHeaderTitle: string;
  homePageHeaderElevation: number;
  settingsPageHeaderTitle: string;
  settingsPageHeaderElevation: number;
};

export default function DrawerNavigator({
  theme,
  homePageHeaderTitle,
  homePageHeaderElevation,
  settingsPageHeaderTitle,
  settingsPageHeaderElevation,
}: Props) {
  const { top } = useSafeAreaInsets();
  const baseHeaderStyle = useHeaderConfig(theme, top);
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = Math.min(320, screenWidth * 0.8);

  const screenOptions = useMemo(
    () => ({
      ...defaultDrawerScreenOptions,
      drawerStyle: {
        width: drawerWidth,
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.basic,
        borderWidth: theme.borderWidth.medium,
        borderRadius: theme.borderRadius,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        overflow: 'hidden' as const,
      },
      drawerContentStyle: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderColor: theme.colors.basic,
        borderWidth: theme.borderWidth.medium,
      },
      drawerLabelStyle: {
        fontSize: theme.fontSize.medium,
        color: theme.colors.headerForeground,
      },
      drawerActiveTintColor: theme.colors.headerForeground,
      drawerInactiveTintColor: theme.colors.disabled,
      drawerItemStyle: {
        marginVertical: theme.margin.small,
        marginHorizontal: theme.margin.medium,
      },
      headerTitle: (props: HeaderTitleProps) => <HeaderTitle {...props} />,
      headerTitleStyle: {
        color: theme.colors.headerForeground,
        fontStyle: theme.typography.header.headerTitleStyle,
        fontSize: theme.typography.header.headerTitleSize,
        letterSpacing: theme.typography.header.headerTitleLetterSpacing,
        lineHeight: theme.typography.header.headerTitleLineHeight,
      },
      headerLargeTitleStyle: Platform.select({
        ios: {
          color: theme.colors.headerForeground,
          fontStyle: theme.typography.header.headerTitleStyle,
          fontSize: theme.typography.header.headerLargeTitleSize,
          letterSpacing: theme.typography.header.headerLargeTitleLetterSpacing,
          lineHeight: theme.typography.header.headerLargeTitleLineHeight,
        },
      }),
      headerTintColor: theme.colors.headerForeground,
      headerStyle: baseHeaderStyle,
      headerShadowVisible: theme.headerShadowVisible,
      sceneContainerStyle: { backgroundColor: theme.colors.background },
    }),
    [
      baseHeaderStyle,
      drawerWidth,
      theme.colors.background,
      theme.colors.basic,
      theme.colors.disabled,
      theme.colors.headerForeground,
      theme.fontSize.medium,
      theme.margin.medium,
      theme.margin.small,
      theme.headerShadowVisible,
      theme.typography.header.headerLargeTitleLetterSpacing,
      theme.typography.header.headerLargeTitleLineHeight,
      theme.typography.header.headerLargeTitleSize,
      theme.typography.header.headerTitleLetterSpacing,
      theme.typography.header.headerTitleLineHeight,
      theme.typography.header.headerTitleSize,
      theme.typography.header.headerTitleStyle,
    ]
  );

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={screenOptions}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
        <Drawer.Screen
          name="Home"
          component={HomePageScreen}
          options={({ navigation }: DrawerScreenProps<DrawerParamList, 'Home'>) => ({
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
          })}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation }: DrawerScreenProps<DrawerParamList, 'Settings'>) => ({
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
          })}
        />
    </Drawer.Navigator>
  );
}
