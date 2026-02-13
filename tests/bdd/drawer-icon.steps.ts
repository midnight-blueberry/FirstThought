import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

let lastRenderedIconProps: { name?: string; size?: number; color?: string } = {};

jest.mock('@expo/vector-icons', () => {
  const React = require('react');

  return {
    MaterialIcons: ({ name, size, color }: { name: string; size: number; color: string }) => {
      lastRenderedIconProps = { name, size, color };
      return React.createElement('span', null);
    },
  };
});

import { DrawerIcon } from '@/navigation/ui/DrawerIcon';

type RouteName = 'Home' | 'Settings';

type ScenarioContext = {
  size: number;
  color: string;
  routeName: RouteName;
  focused: boolean;
};

const routeToIconName: Record<RouteName, 'home' | 'settings'> = {
  Home: 'home',
  Settings: 'settings',
};

export default (test: JestCucumberTestFn) => {
  const runScenario = (scenarioName: string) => {
    test(scenarioName, ({ given, when, then }: StepDefinitions) => {
      const context: ScenarioContext = {
        size: 24,
        color: '#FF0000',
        routeName: 'Home',
        focused: false,
      };

      given(/^drawer icon size is (\d+)$/, (size: string) => {
        context.size = Number(size);
      });

      given(/^drawer icon color is "([^"]+)"$/, (color: string) => {
        context.color = color;
      });

      given(/^drawer route name is "(Home|Settings)"$/, (routeName: RouteName) => {
        context.routeName = routeName;
      });

      given(/^drawer icon focused is (true|false)$/, (focused: 'true' | 'false') => {
        context.focused = focused === 'true';
      });

      when('DrawerIcon is rendered', () => {
        lastRenderedIconProps = {};

        const iconName = routeToIconName[context.routeName];
        const IconComponent = DrawerIcon(iconName) as React.ComponentType<any>;

        ReactDOMServer.renderToStaticMarkup(
          React.createElement(IconComponent, {
            size: context.size,
            color: context.color,
            focused: context.focused,
          }),
        );
      });

      then(/^icon name should be "([^"]+)"$/, (expectedName: string) => {
        expect(lastRenderedIconProps.name).toBe(expectedName);
      });

      then(/^icon size should be (\d+)$/, (expectedSize: string) => {
        expect(lastRenderedIconProps.size).toBe(Number(expectedSize));
      });

      then(/^icon color should be "([^"]+)"$/, (expectedColor: string) => {
        expect(lastRenderedIconProps.color).toBe(expectedColor);
      });
    });
  };

  runScenario('Route icon mapping returns Home icon and forwards size and color');
  runScenario('Route icon mapping returns Settings icon and forwards size and color');
};
