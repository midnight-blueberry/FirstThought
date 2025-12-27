import React, { useEffect } from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderWithProviders } from '@tests/utils/render';
import SaveIndicator, { SaveIndicatorProvider, useSaveIndicator } from '@/components/header/SaveIndicator';

const animationStartCallbacks: Array<(result: { finished: boolean }) => void> = [];

jest.mock('react-native', () => {
  const React = require('react');

  class Value {
    private value: number;

    constructor(value: number) {
      this.value = value;
    }

    setValue(value: number) {
      this.value = value;
    }

    stopAnimation(cb?: (value: number) => void) {
      cb?.(this.value);
    }
  }

  const createAnimation = () => {
    let callback: ((result: { finished: boolean }) => void) | undefined;

    return {
      start: (cb: (result: { finished: boolean }) => void) => {
        callback = cb;
        animationStartCallbacks.push(cb);
      },
      stop: () => {
        callback?.({ finished: false });
      },
    };
  };

  const Animated = {
    Value,
    timing: () => createAnimation(),
    delay: () => createAnimation(),
    sequence: () => createAnimation(),
    View: ({ children }: any) => React.createElement('View', null, children),
  };

  const Easing = { inOut: (fn: any) => fn, quad: 'quad' };
  const StyleSheet = { create: (styles: any) => styles };

  return {
    Animated,
    Easing,
    StyleSheet,
  };
});

jest.mock('@hooks/useTheme', () => () => ({
  padding: { large: 16 },
  iconSize: { medium: 24 },
  colors: { headerForeground: '#000000' },
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  let indicatorApi: ReturnType<typeof useSaveIndicator> | null = null;
  let tree: any = null;

  afterEach(async () => {
    animationStartCallbacks.splice(0);
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    indicatorApi = null;
    jest.clearAllMocks();
  });

  test('Completing an older animation does not hide a newer save indicator', ({
    given,
    when,
    then,
    and,
  }) => {
    given('the save indicator is rendered', async () => {
      const TestComponent: React.FC<{ onReady: (api: ReturnType<typeof useSaveIndicator>) => void }> = ({
        onReady,
      }) => {
        const api = useSaveIndicator();

        useEffect(() => {
          onReady(api);
        }, [api, onReady]);

        return null;
      };

      await act(async () => {
        tree = renderWithProviders(
          <SaveIndicatorProvider>
            <TestComponent onReady={(api) => {
              indicatorApi = api;
            }} />
            <SaveIndicator />
          </SaveIndicatorProvider>,
        );
      });
    });

    when('showFor2s is called twice quickly', async () => {
      await act(async () => {
        indicatorApi?.showFor2s();
        indicatorApi?.showFor2s();
      });
    });

    and('the first animation completes', () => {
      act(() => {
        animationStartCallbacks[0]?.({ finished: true });
      });
    });

    then('the save indicator remains visible', () => {
      expect(tree.toJSON()).not.toBeNull();
    });

    and('after the second animation completes the save indicator is hidden', () => {
      act(() => {
        animationStartCallbacks[1]?.({ finished: true });
      });

      expect(tree.toJSON()).toBeNull();
    });
  });
});

export { animationStartCallbacks };
