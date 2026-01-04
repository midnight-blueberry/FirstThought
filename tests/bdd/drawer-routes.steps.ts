import React from 'react';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { DefaultTheme } from 'styled-components/native';

jest.mock('@react-navigation/native', () => ({
  DrawerActions: { openDrawer: jest.fn(() => ({ type: 'OPEN_DRAWER' })) },
}));

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  return {
    IconButton: ({ icon, onPress }: any) => React.createElement('IconButton', { icon, onPress }),
  };
});

jest.mock('@components/header/SaveIndicator', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('SaveIndicator'),
  };
});

jest.mock('@/navigation/ui/DrawerIcon', () => ({
  DrawerIcon: jest.fn((name: string) => `drawer-icon-${name}`),
}));

jest.mock('@screens/home-page', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('HomePageScreen'),
  };
});

jest.mock('@screens/settings', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('SettingsScreen'),
  };
});

const { DrawerActions } = jest.requireMock('@react-navigation/native');
const { default: MockedSaveIndicator } = jest.requireMock('@components/header/SaveIndicator');
const { drawerRoutes } = require('@/navigation/drawer/routes') as {
  drawerRoutes: typeof import('@/navigation/drawer/routes').drawerRoutes;
};

export default (test: JestCucumberTestFn) => {
  test('Builds drawer routes with expected configuration', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    let theme: DefaultTheme;
    let baseHeaderStyle: Record<string, unknown>;
    let homePageHeaderTitle: string;
    let homePageHeaderElevation: number;
    let settingsPageHeaderTitle: string;
    let settingsPageHeaderElevation: number;
    let routes: ReturnType<typeof drawerRoutes>;

    given('a drawer routes config', () => {
      theme = {
        colors: {
          headerForeground: '#ffffff',
        },
      } as DefaultTheme;
      baseHeaderStyle = { backgroundColor: '#101010' };
      homePageHeaderTitle = 'Home header';
      homePageHeaderElevation = 4;
      settingsPageHeaderTitle = 'Settings header';
      settingsPageHeaderElevation = 2;
    });

    when('I build drawer routes', () => {
      routes = drawerRoutes({
        theme,
        baseHeaderStyle,
        homePageHeaderTitle,
        homePageHeaderElevation,
        settingsPageHeaderTitle,
        settingsPageHeaderElevation,
      });
    });

    then('it returns two routes named Home and Settings in order', () => {
      expect(routes).toHaveLength(2);
      expect(routes[0].name).toBe('Home');
      expect(routes[1].name).toBe('Settings');
    });

    then('Home route renders correct options with header components', () => {
      const navigation = { dispatch: jest.fn(), goBack: jest.fn() } as any;
      const options = routes[0].options({ navigation } as any);

      expect(options.title).toBe(homePageHeaderTitle);
      expect(options.drawerIcon).toBe('drawer-icon-home');
      expect(options.headerTintColor).toBe(theme.colors.headerForeground);
      expect(options.headerStyle).toEqual({
        ...baseHeaderStyle,
        elevation: homePageHeaderElevation,
      });

      const headerLeft = options.headerLeft?.();
      expect(React.isValidElement(headerLeft)).toBe(true);
      expect((headerLeft as any)?.props.icon).toBe('menu');

      (headerLeft as any)?.props.onPress();
      expect(navigation.dispatch).toHaveBeenCalledWith(DrawerActions.openDrawer());

      const headerRight = options.headerRight?.();
      expect(React.isValidElement(headerRight)).toBe(true);
      expect((headerRight as any)?.props.icon).toBe('search');
    });

    then('Settings route renders correct options with header components', () => {
      const navigation = { dispatch: jest.fn(), goBack: jest.fn() } as any;
      const options = routes[1].options({ navigation } as any);

      expect(options.title).toBe(settingsPageHeaderTitle);
      expect(options.drawerIcon).toBe('drawer-icon-settings');
      expect(options.headerTintColor).toBe(theme.colors.headerForeground);
      expect(options.headerStyle).toEqual({
        ...baseHeaderStyle,
        elevation: settingsPageHeaderElevation,
      });

      const headerLeft = options.headerLeft?.();
      expect(React.isValidElement(headerLeft)).toBe(true);
      expect((headerLeft as any)?.props.icon).toBe('chevron-back');

      (headerLeft as any)?.props.onPress();
      expect(navigation.goBack).toHaveBeenCalled();

      const headerRight = options.headerRight?.();
      expect(React.isValidElement(headerRight)).toBe(true);
      expect((headerRight as any).type).toBe(MockedSaveIndicator);
    });
  });
};
