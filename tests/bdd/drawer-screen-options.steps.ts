import React from 'react';
import { drawerScreenOptions } from '@/navigation/drawer/options';
import { defaultDrawerScreenOptions } from '@/navigation/options/drawerOptions';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { DefaultTheme } from 'styled-components/native';
import type { DrawerNavigationOptions } from '@react-navigation/drawer';
import type { HeaderTitleProps } from '@react-navigation/elements';

jest.mock('@components/ui/atoms', () => {
  const React = require('react');
  return {
    HeaderTitle: (props: any) => React.createElement('HeaderTitle', props),
  };
});

export default (test: JestCucumberTestFn) => {
  test('Builds drawer options with defaults and theme values', ({ given, when, then }: StepDefinitions) => {
    let drawerWidth: number;
    let theme: DefaultTheme;
    let baseHeaderStyle: Record<string, unknown>;
    let options: DrawerNavigationOptions;

    given('a drawer width of 280', () => {
      drawerWidth = 280;
    });

    given('a theme with drawer styling values', () => {
      theme = {
        colors: {
          background: '#111111',
          basic: '#222222',
          headerForeground: '#fafafa',
          disabled: '#cccccc',
        },
        borderWidth: { medium: 2 },
        borderRadius: 12,
        margin: { small: 4, medium: 8 },
        fontSize: { medium: 16 },
        typography: {
          header: {
            headerTitleStyle: 'italic',
            headerTitleSize: 20,
            headerTitleLetterSpacing: 1.2,
            headerTitleLineHeight: 22,
            headerLargeTitleSize: 28,
            headerLargeTitleLetterSpacing: 1.6,
            headerLargeTitleLineHeight: 32,
          },
        },
        headerShadowVisible: false,
      } as DefaultTheme;
    });

    given('a base header style object', () => {
      baseHeaderStyle = { backgroundColor: '#333333' };
    });

    when('I build drawer screen options', () => {
      options = drawerScreenOptions({ drawerWidth, theme, baseHeaderStyle });
    });

    then('it includes default drawer options', () => {
      expect(options).toEqual(expect.objectContaining(defaultDrawerScreenOptions));
    });

    then('it uses the drawer width and theme styles', () => {
      expect(options.drawerStyle).toMatchObject({
        width: drawerWidth,
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.basic,
        borderWidth: theme.borderWidth.medium,
        borderRadius: theme.borderRadius,
        overflow: 'hidden',
      });
    });

    then('it applies the base header style and tint color', () => {
      expect(options.headerStyle).toBe(baseHeaderStyle);
      expect(options.headerTintColor).toBe(theme.colors.headerForeground);
    });

    then('it defines large title style for iOS', () => {
      const headerLargeTitleStyle = (options as any).headerLargeTitleStyle;

      expect(typeof headerLargeTitleStyle).toBe('object');
      expect(headerLargeTitleStyle).toMatchObject({
        color: theme.colors.headerForeground,
        fontStyle: theme.typography.header.headerTitleStyle,
        fontSize: theme.typography.header.headerLargeTitleSize,
        letterSpacing: theme.typography.header.headerLargeTitleLetterSpacing,
        lineHeight: theme.typography.header.headerLargeTitleLineHeight,
      });
    });

    then('headerTitle forwards props to the HeaderTitle component', () => {
      const props: HeaderTitleProps = { children: 'Drawer title' } as HeaderTitleProps;
      const renderHeaderTitle = options.headerTitle as unknown as (p: HeaderTitleProps) => React.ReactNode;
      const element = renderHeaderTitle?.(props);

      expect(React.isValidElement(element)).toBe(true);
      expect((element as any)?.props).toMatchObject(props);
    });
  });
};
