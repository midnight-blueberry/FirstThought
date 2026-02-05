import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

let mockTopInset = 0;

const baseHeaderStyle = { backgroundColor: '#123456' };

const drawerScreenOptions = jest.fn(() => ({}));
const drawerRoutes = jest.fn(() => [
  { name: 'Home', component: () => null },
  { name: 'Settings', component: () => null },
]);

const drawerLinking = { mocked: true };
const DrawerContent = () => null;

let lastNavigatorProps: Record<string, unknown> | null = null;
let lastScreenProps: Array<Record<string, unknown>> = [];

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({
    top: mockTopInset,
    bottom: 0,
    left: 0,
    right: 0,
  }),
}));

jest.mock('@hooks/useHeaderConfig', () => jest.fn(() => baseHeaderStyle));

jest.mock('@react-navigation/drawer', () => {
  const React = require('react');
  return {
    createDrawerNavigator: () => ({
      Navigator: (props: Record<string, unknown>) => {
        lastNavigatorProps = props;
        return React.createElement(React.Fragment, null, props.children);
      },
      Screen: (props: Record<string, unknown>) => {
        lastScreenProps.push(props);
        return null;
      },
    }),
  };
});

jest.mock('@/navigation/drawer', () => ({
  DrawerContent,
  drawerLinking,
  drawerRoutes,
  drawerScreenOptions,
}));

const RN = require('react-native') as any;
const useHeaderConfig = require('@hooks/useHeaderConfig') as jest.Mock;
const DrawerNavigator = require('@/navigation/DrawerNavigator').default;

export default (test: JestCucumberTestFn) => {
  test('Builds drawer options for large screens', ({ given, when, then }: StepDefinitions) => {
    const theme = { colors: { background: '#000000' } } as any;

    given(/^screen width is (\d+)$/, (value: string) => {
      RN.Dimensions.get.mockImplementation(() => ({ width: Number(value), height: 800 }));
    });

    given(/^safe area top inset is (\d+)$/, (value: string) => {
      mockTopInset = Number(value);
    });

    when('DrawerNavigator is rendered', () => {
      drawerScreenOptions.mockClear();
      drawerRoutes.mockClear();
      useHeaderConfig.mockClear();
      lastNavigatorProps = null;
      lastScreenProps = [];

      ReactDOMServer.renderToStaticMarkup(
        React.createElement(DrawerNavigator, {
          theme,
          homePageHeaderTitle: 'Home',
          homePageHeaderElevation: 1,
          settingsPageHeaderTitle: 'Settings',
          settingsPageHeaderElevation: 2,
        }),
      );
    });

    then(/^drawerScreenOptions is called with drawerWidth (\d+)$/, (value: string) => {
      expect(drawerScreenOptions).toHaveBeenCalledWith(
        expect.objectContaining({ drawerWidth: Number(value) }),
      );
    });

    then(/^useHeaderConfig is called with top inset (\d+)$/, (value: string) => {
      expect(useHeaderConfig).toHaveBeenCalledWith(theme, Number(value));
    });

    then('drawerRoutes is called with baseHeaderStyle returned by useHeaderConfig', () => {
      expect(drawerRoutes).toHaveBeenCalledWith(
        expect.objectContaining({ baseHeaderStyle }),
      );
    });
  });

  test('Builds drawer options for small screens', ({ given, when, then }: StepDefinitions) => {
    const theme = { colors: { background: '#000000' } } as any;

    given(/^screen width is (\d+)$/, (value: string) => {
      RN.Dimensions.get.mockImplementation(() => ({ width: Number(value), height: 800 }));
    });

    given(/^safe area top inset is (\d+)$/, (value: string) => {
      mockTopInset = Number(value);
    });

    when('DrawerNavigator is rendered', () => {
      drawerScreenOptions.mockClear();
      drawerRoutes.mockClear();
      useHeaderConfig.mockClear();
      lastNavigatorProps = null;
      lastScreenProps = [];

      ReactDOMServer.renderToStaticMarkup(
        React.createElement(DrawerNavigator, {
          theme,
          homePageHeaderTitle: 'Home',
          homePageHeaderElevation: 1,
          settingsPageHeaderTitle: 'Settings',
          settingsPageHeaderElevation: 2,
        }),
      );
    });

    then(/^drawerScreenOptions is called with drawerWidth (\d+)$/, (value: string) => {
      expect(drawerScreenOptions).toHaveBeenCalledWith(
        expect.objectContaining({ drawerWidth: Number(value) }),
      );
    });
  });
};
