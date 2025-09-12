import React from 'react';
import { Platform } from 'react-native';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import { HeaderTitle } from '@components/ui/atoms';
import type { HeaderTitleProps } from '@react-navigation/elements';
import type { DefaultTheme } from 'styled-components/native';

import { defaultDrawerScreenOptions } from '../options/drawerOptions';

export type DrawerScreenOptionsParams = {
  drawerWidth: number;
  theme: DefaultTheme;
  baseHeaderStyle: any;
};

export const drawerScreenOptions = (
  { drawerWidth, theme, baseHeaderStyle }: DrawerScreenOptionsParams,
): DrawerNavigationOptions =>
  ({
  ...defaultDrawerScreenOptions,
  drawerStyle: {
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
  headerTitle: (props: HeaderTitleProps) => React.createElement(HeaderTitle, props),
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
  } as DrawerNavigationOptions);

