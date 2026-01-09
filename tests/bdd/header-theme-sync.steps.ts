import React from 'react';
import renderer from 'react-test-renderer';

import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type Theme = {
  colors: { background: string };
  isDark: boolean;
};

type ReactNativeMock = {
  __mock: {
    views: Array<{ type: string; props: any }>;
  };
};

const getReactNativeMock = () => (jest.requireActual('react-native') as ReactNativeMock).__mock;

export default (test: JestCucumberTestFn) => {
  let currentTheme: Theme;
  let setOptionsMock: jest.Mock;
  let transparent: boolean;

  const mockModules = () => {
    jest.doMock('react', () => {
      const actual = jest.requireActual('react');
      return {
        __esModule: true,
        default: actual,
        ...actual,
        useLayoutEffect: (callback: () => void) => callback(),
      };
    });

    jest.doMock('expo-router', () => ({
      __esModule: true,
      useNavigation: () => ({ setOptions: setOptionsMock }),
    }));

    jest.doMock('@hooks/useTheme', () => ({
      __esModule: true,
      default: () => currentTheme,
    }));
  };

  const renderHeaderThemeSync = async () => {
    const module = await import('@/components/header/useHeaderThemeSync');
    const HeaderThemeSync = module.default as React.ComponentType<{ transparent?: boolean }>;
    renderer.create(React.createElement(HeaderThemeSync, { transparent }));
  };

  const getLatestStatusBarProps = () => {
    const { views } = getReactNativeMock();
    const statusBars = views.filter((view) => view.type === 'StatusBar');
    return statusBars[statusBars.length - 1]?.props ?? null;
  };

  beforeEach(() => {
    currentTheme = { colors: { background: '#000000' }, isDark: false };
    setOptionsMock = jest.fn();
    transparent = false;
    jest.resetModules();
    mockModules();
    const { views } = getReactNativeMock();
    views.length = 0;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('applies light theme header options and status bar style', ({ given, when, then }: StepDefinitions) => {
    given('a light theme with background "#ABCDEF"', () => {
      currentTheme = { colors: { background: '#ABCDEF' }, isDark: false };
    });

    when('the header theme sync component is rendered', async () => {
      transparent = false;
      await renderHeaderThemeSync();
    });

    then('navigation options set header background to "#ABCDEF"', () => {
      expect(setOptionsMock).toHaveBeenCalledWith({
        headerStyle: { backgroundColor: '#ABCDEF' },
        headerTransparent: false,
        headerTintColor: '#000',
      });
    });

    then('header is not transparent', () => {
      const call = setOptionsMock.mock.calls[0]?.[0];
      expect(call?.headerTransparent).toBe(false);
    });

    then('header tint color is "#000"', () => {
      const call = setOptionsMock.mock.calls[0]?.[0];
      expect(call?.headerTintColor).toBe('#000');
    });

    then('status bar barStyle is "dark-content"', () => {
      const statusBarProps = getLatestStatusBarProps();
      expect(statusBarProps?.barStyle).toBe('dark-content');
    });

    then('status bar is translucent', () => {
      const statusBarProps = getLatestStatusBarProps();
      expect(statusBarProps?.translucent).toBe(true);
    });
  });

  test('applies dark theme header options when transparent is true', ({ given, when, then }: StepDefinitions) => {
    given('a dark theme with background "#111111"', () => {
      currentTheme = { colors: { background: '#111111' }, isDark: true };
    });

    when('the header theme sync component is rendered with transparent', async () => {
      transparent = true;
      await renderHeaderThemeSync();
    });

    then('navigation options set header background to "transparent"', () => {
      expect(setOptionsMock).toHaveBeenCalledWith({
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
        headerTintColor: '#fff',
      });
    });

    then('header is transparent', () => {
      const call = setOptionsMock.mock.calls[0]?.[0];
      expect(call?.headerTransparent).toBe(true);
    });

    then('header tint color is "#fff"', () => {
      const call = setOptionsMock.mock.calls[0]?.[0];
      expect(call?.headerTintColor).toBe('#fff');
    });

    then('status bar barStyle is "light-content"', () => {
      const statusBarProps = getLatestStatusBarProps();
      expect(statusBarProps?.barStyle).toBe('light-content');
    });

    then('status bar is translucent', () => {
      const statusBarProps = getLatestStatusBarProps();
      expect(statusBarProps?.translucent).toBe(true);
    });
  });
};
