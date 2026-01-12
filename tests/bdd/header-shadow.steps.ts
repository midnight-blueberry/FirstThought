import React from 'react';
import renderer from 'react-test-renderer';

import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { makeScrollEvent } from '@tests/utils/makeScrollEvent';

type Theme = {
  colors: { headerBackground: string };
  iconSize: { medium: number };
  padding: { large: number };
};

type HeaderShadowHandler = ReturnType<typeof makeScrollEvent> extends infer T
  ? (event: T) => void
  : never;

export default (test: JestCucumberTestFn) => {
  const theme: Theme = {
    colors: { headerBackground: '#123456' },
    iconSize: { medium: 20 },
    padding: { large: 12 },
  };

  const topInset = 10;

  let setOptionsMock: jest.Mock;
  let scrollHandler: HeaderShadowHandler | undefined;

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

  const renderHook = async () => {
    const module = await import('@hooks/useHeaderShadow');
    const useHeaderShadow = module.default as () => (event: ReturnType<typeof makeScrollEvent>) => void;
    const HookConsumer = () => {
      scrollHandler = useHeaderShadow();
      return null;
    };

    renderer.create(React.createElement(HookConsumer));
  };

  const getExpectedHeaderHeight = () => topInset + theme.iconSize.medium + theme.padding.large * 2;

  beforeEach(() => {
    setOptionsMock = jest.fn();
    scrollHandler = undefined;
    jest.resetModules();
    mockModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('offset zero keeps header flat', ({ given, when, then }: StepDefinitions) => {
    given('the header shadow hook is rendered', async () => {
      await renderHook();
    });

    when('the scroll offset is 0', () => {
      scrollHandler?.(makeScrollEvent(0));
    });

    then('navigation options disable the header shadow', () => {
      expect(setOptionsMock).toHaveBeenCalledWith({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
          elevation: 0,
          height: getExpectedHeaderHeight(),
        },
      });
    });
  });

  test('offset ten enables header shadow', ({ given, when, then }: StepDefinitions) => {
    given('the header shadow hook is rendered', async () => {
      await renderHook();
    });

    when('the scroll offset is 10', () => {
      scrollHandler?.(makeScrollEvent(10));
    });

    then('navigation options enable the header shadow', () => {
      expect(setOptionsMock).toHaveBeenCalledWith({
        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
          elevation: 4,
          height: getExpectedHeaderHeight(),
        },
      });
    });
  });
};
