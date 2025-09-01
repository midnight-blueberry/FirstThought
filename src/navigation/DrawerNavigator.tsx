import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme } from 'styled-components/native';
import { IconButton } from '@components/ui/atoms';
import useHeaderConfig from '@hooks/useHeaderConfig';
import HomePageScreen from '@screens/home-page';
import SettingsScreen from '@screens/settings';
import { closestAvailableWeight, isVariableFamily } from '@constants/fonts';
import type { FontFamily, FontWeight } from '@constants/fonts';
import type { TextStyle } from 'react-native';

import DrawerContent from './DrawerContent';
import { DrawerIcon } from './ui/DrawerIcon';
import { defaultDrawerScreenOptions } from './options/drawerOptions';
import type { DrawerParamList } from './types';

const Drawer = createDrawerNavigator<DrawerParamList>();

const fontStyle = (family: FontFamily, weight: FontWeight): TextStyle =>
  isVariableFamily(family)
    ? { fontFamily: family, fontWeight: String(weight) as TextStyle['fontWeight'] }
    : { fontFamily: `${family}-${closestAvailableWeight(family, weight)}` };

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
  const headerTitleFont = fontStyle(
    theme.typography.header.headerTitleFamily as FontFamily,
    theme.typography.header.headerTitleWeight as FontWeight,
  );
  const headerLargeTitleFont = fontStyle(
    theme.typography.header.headerTitleFamily as FontFamily,
    theme.typography.header.headerLargeTitleWeight as FontWeight,
  );
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = Math.min(320, screenWidth * 0.8);

  return (
    <Drawer.Navigator
      key={theme.typography.header.headerTitleFamily + theme.name}
      initialRouteName="Home"
      screenOptions={() => ({
        ...defaultDrawerScreenOptions,
        drawerStyle: {
          marginTop: top,
          width: drawerWidth,
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.basic,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          overflow: 'hidden',
        },
        drawerContentStyle: {
          paddingTop: 20,
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderColor: theme.colors.basic,
          borderWidth: theme.borderWidth.medium,
        },
        drawerLabelStyle: {
          ...headerTitleFont,
          fontSize: theme.fontSize.medium,
          color: theme.colors.headerForeground,
        },
        drawerActiveTintColor: theme.colors.headerForeground,
        drawerInactiveTintColor: theme.colors.disabled,
        drawerItemStyle: {
          marginVertical: theme.margin.small,
          marginHorizontal: theme.margin.medium,
        },
          headerTitleStyle: {
            color: theme.colors.headerForeground,
            ...headerTitleFont,
            fontStyle: theme.typography.header.headerTitleStyle,
            fontSize: theme.typography.header.headerTitleSize,
            letterSpacing: theme.typography.header.headerTitleLetterSpacing,
            lineHeight: theme.typography.header.headerTitleLineHeight,
          },
          headerLargeTitleStyle: Platform.select({
            ios: {
              color: theme.colors.headerForeground,
              ...headerLargeTitleFont,
              fontStyle: theme.typography.header.headerTitleStyle,
              fontSize: theme.typography.header.headerLargeTitleSize,
              letterSpacing: theme.typography.header.headerLargeTitleLetterSpacing,
              lineHeight: theme.typography.header.headerLargeTitleLineHeight,
            },
          }),
        headerTintColor: theme.colors.headerForeground,
        headerStyle: baseHeaderStyle,
        headerShadowVisible: theme.headerShadowVisible,
        headerTransparent: false,
      })}
      drawerContent={(props) => <DrawerContent {...props} />}
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
