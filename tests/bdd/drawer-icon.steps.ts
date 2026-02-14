import React from 'react';
import ReactDOMServer from 'react-dom/server';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type MaterialIconProps = {
  name: string;
  size: number;
  color: string;
};

let lastMaterialIconProps: MaterialIconProps | null = null;

jest.mock('@expo/vector-icons', () => {
  const React = require('react');

  return {
    MaterialIcons: ({ name, size, color }: MaterialIconProps) => {
      lastMaterialIconProps = { name, size, color };
      return React.createElement('span', null);
    },
  };
});

import { DrawerIcon } from '@/navigation/ui/DrawerIcon';

type DrawerIconName = Parameters<typeof DrawerIcon>[0];

export default (test: JestCucumberTestFn) => {
  test('Renders callback icon for home', ({ given, when, then }: StepDefinitions) => {
    let iconName = '';
    let size = 0;
    let color = '';

    given('material icon name is "home"', () => {
      iconName = 'home';
    });

    given('drawer icon size is 24', () => {
      size = 24;
    });

    given('drawer icon color is "#FF0000"', () => {
      color = '#FF0000';
    });

    when('DrawerIcon callback is rendered', () => {
      lastMaterialIconProps = null;
      const renderIcon = DrawerIcon(iconName as DrawerIconName);
      const element = renderIcon({ color, size });
      ReactDOMServer.renderToStaticMarkup(element as any);
    });

    then('MaterialIcons name should be "home"', () => {
      expect(lastMaterialIconProps?.name).toBe('home');
    });

    then('MaterialIcons size should be 24', () => {
      expect(lastMaterialIconProps?.size).toBe(24);
    });

    then('MaterialIcons color should be "#FF0000"', () => {
      expect(lastMaterialIconProps?.color).toBe('#FF0000');
    });
  });

  test('Renders callback icon for settings', ({ given, when, then }: StepDefinitions) => {
    let iconName = '';
    let size = 0;
    let color = '';

    given('material icon name is "settings"', () => {
      iconName = 'settings';
    });

    given('drawer icon size is 20', () => {
      size = 20;
    });

    given('drawer icon color is "#00FF00"', () => {
      color = '#00FF00';
    });

    when('DrawerIcon callback is rendered', () => {
      lastMaterialIconProps = null;
      const renderIcon = DrawerIcon(iconName as DrawerIconName);
      const element = renderIcon({ color, size });
      ReactDOMServer.renderToStaticMarkup(element as any);
    });

    then('MaterialIcons name should be "settings"', () => {
      expect(lastMaterialIconProps?.name).toBe('settings');
    });

    then('MaterialIcons size should be 20', () => {
      expect(lastMaterialIconProps?.size).toBe(20);
    });

    then('MaterialIcons color should be "#00FF00"', () => {
      expect(lastMaterialIconProps?.color).toBe('#00FF00');
    });
  });
};
