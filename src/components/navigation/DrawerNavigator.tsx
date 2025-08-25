import React from 'react';
import { IconButton } from '@components/ui/atoms';
import { Drawer } from 'expo-router/drawer';
import { DrawerActions } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { ParamListBase } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { DefaultTheme } from 'styled-components/native';

import CustomDrawerContent from '@components/navigation/CustomDrawerContent';
import useHeaderConfig from '@hooks/useHeaderConfig';

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

  return (
    <Drawer
      initialRouteName="home-page"
      screenOptions={() => ({
        headerShown: true,
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
          fontFamily: theme.fontName,
          fontSize: theme.fontSize.medium,
          fontWeight: theme.fontWeight,
          color: theme.colors.basic,
        },
        drawerActiveTintColor: theme.colors.basic,
        drawerInactiveTintColor: theme.colors.disabled,
        drawerItemStyle: {
          marginVertical: theme.margin.small,
          marginHorizontal: theme.margin.medium,
        },
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
          headerRight: () => <IconButton icon="search" onPress={() => null} />,
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
