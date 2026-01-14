import React from 'react';
import renderer from 'react-test-renderer';

import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type Theme = {
  colors: { headerBackground: string };
  iconSize: { medium: number };
  padding: { large: number };
};

type HeaderOptions = {
  headerShadowVisible: boolean;
  headerStyle: { backgroundColor: string; elevation: number; height: number };
};

export default (test: JestCucumberTestFn) => {
  let theme: Theme;
  let topInset: number;
  let scrollOffset: number;
  let setOptionsMock: jest.Mock;
  let scrollHandler: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | null;
  let tree: renderer.ReactTestRenderer | null;

  const mockModules = () => {
    jest.doMock('expo-router', () => ({
      __esModule: true,
      useNavigation: () => ({ setOptions: setOptionsMock }),
    }));

    jest.doMock('react-native-safe-area-context', () => ({
      __esModule: true,
      useSafeAreaInsets: () => ({ top: topInset }),
    }));

    jest.doMock('styled-components/native', () => ({
      __esModule: true,
      useTheme: () => theme,
    }));
  };

  const renderHeaderShadow = async () => {
    const module = await import('@/hooks/useHeaderShadow');
    const useHeaderShadow = module.default;

    const TestComponent = () => {
      scrollHandler = useHeaderShadow();
      return null;
    };

    tree = renderer.create(React.createElement(TestComponent));
  };

  const getLatestHeaderOptions = () => {
    const call = setOptionsMock.mock.calls[setOptionsMock.mock.calls.length - 1]?.[0];
    return call as HeaderOptions | undefined;
  };

  beforeEach(() => {
    theme = {
      colors: { headerBackground: '#000000' },
      iconSize: { medium: 0 },
      padding: { large: 0 },
    };
    topInset = 0;
    scrollOffset = 0;
    scrollHandler = null;
    setOptionsMock = jest.fn();
    tree = null;
    jest.resetModules();
    mockModules();
  });

  afterEach(() => {
    tree?.unmount();
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('hides shadow when scroll offset is zero', ({ given, when, then }: StepDefinitions) => {
    given(/^a theme with header background "([^"]+)", medium icon size (\d+), and large padding (\d+)$/, (
      background: string,
      medium: string,
      large: string,
    ) => {
      theme = {
        colors: { headerBackground: background },
        iconSize: { medium: Number(medium) },
        padding: { large: Number(large) },
      };
    });

    given(/^a top inset of (\d+)$/, (value: string) => {
      topInset = Number(value);
    });

    given(/^a scroll offset of (\d+)$/, (value: string) => {
      scrollOffset = Number(value);
    });

    when('the header shadow hook is rendered', async () => {
      await renderHeaderShadow();
    });

    when('the scroll handler is invoked', () => {
      if (!scrollHandler) {
        throw new Error('Scroll handler is not available');
      }

      scrollHandler({
        nativeEvent: {
          contentOffset: { y: scrollOffset },
        },
      } as NativeSyntheticEvent<NativeScrollEvent>);
    });

    then('header shadow is not visible', () => {
      const options = getLatestHeaderOptions();
      expect(options?.headerShadowVisible).toBe(false);
    });

    then('header elevation is 0', () => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.elevation).toBe(0);
    });

    then(/^header height is (\d+)$/, (value: string) => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.height).toBe(Number(value));
    });

    then(/^header background color is "([^"]+)"$/, (background: string) => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.backgroundColor).toBe(background);
    });
  });

  test('shows shadow when scroll offset is positive', ({ given, when, then }: StepDefinitions) => {
    given(/^a theme with header background "([^"]+)", medium icon size (\d+), and large padding (\d+)$/, (
      background: string,
      medium: string,
      large: string,
    ) => {
      theme = {
        colors: { headerBackground: background },
        iconSize: { medium: Number(medium) },
        padding: { large: Number(large) },
      };
    });

    given(/^a top inset of (\d+)$/, (value: string) => {
      topInset = Number(value);
    });

    given(/^a scroll offset of (\d+)$/, (value: string) => {
      scrollOffset = Number(value);
    });

    when('the header shadow hook is rendered', async () => {
      await renderHeaderShadow();
    });

    when('the scroll handler is invoked', () => {
      if (!scrollHandler) {
        throw new Error('Scroll handler is not available');
      }

      scrollHandler({
        nativeEvent: {
          contentOffset: { y: scrollOffset },
        },
      } as NativeSyntheticEvent<NativeScrollEvent>);
    });

    then('header shadow is visible', () => {
      const options = getLatestHeaderOptions();
      expect(options?.headerShadowVisible).toBe(true);
    });

    then('header elevation is 4', () => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.elevation).toBe(4);
    });

    then(/^header height is (\d+)$/, (value: string) => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.height).toBe(Number(value));
    });

    then(/^header background color is "([^"]+)"$/, (background: string) => {
      const options = getLatestHeaderOptions();
      expect(options?.headerStyle.backgroundColor).toBe(background);
    });
  });
};
