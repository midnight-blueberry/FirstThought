import React from 'react';
import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultTheme } from 'styled-components/native';
import useHeaderConfig from '@hooks/useHeaderConfig';

import {
  DrawerContent,
  type DrawerParamList,
  drawerLinking,
  drawerRoutes,
  drawerScreenOptions,
} from './drawer';

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

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={drawerScreenOptions({ drawerWidth, theme, baseHeaderStyle })}
      drawerContent={(props) => <DrawerContent {...props} />}
      // @ts-expect-error Property 'linking' is missing in type but used by navigation container
      linking={drawerLinking}
    >
      {drawerRoutes({
        theme,
        baseHeaderStyle,
        homePageHeaderTitle,
        homePageHeaderElevation,
        settingsPageHeaderTitle,
        settingsPageHeaderElevation,
      }).map((route) => (
        <Drawer.Screen key={route.name} {...(route as any)} />
      ))}
    </Drawer.Navigator>
  );
}
