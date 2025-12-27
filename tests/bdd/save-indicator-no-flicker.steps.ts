import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import SaveIndicator, {
  SaveIndicatorProvider,
  useSaveIndicator,
} from '@/components/header/SaveIndicator';
import { renderWithProviders } from '@tests/utils/render';

jest.mock('react-native', () => {
  const React = require('react');
  const animationStartCallbacks: Array<(status: { finished: boolean }) => void> = [];

  const createAnimation = () => {
    return {
      start: jest.fn((cb?: (status: { finished: boolean }) => void) => {
        if (cb) {
          animationStartCallbacks.push(cb);
        }
      }),
      stop: jest.fn(() => {
        const cb = animationStartCallbacks[animationStartCallbacks.length - 1];
        cb?.({ finished: false });
      }),
    } as const;
  };

  class Value {
    _value: number;
    setValue: jest.Mock<any, any>;
    stopAnimation: jest.Mock<any, any>;
    interpolate: jest.Mock<any, any>;
    addListener: jest.Mock<any, any>;
    removeAllListeners: jest.Mock<any, any>;

    constructor(value = 0) {
      this._value = value;
      this.setValue = jest.fn((v: number) => {
        this._value = v;
      });
      this.stopAnimation = jest.fn((cb?: (value: number) => void) => {
        cb?.(this._value);
      });
      this.interpolate = jest.fn();
      this.addListener = jest.fn();
      this.removeAllListeners = jest.fn();
    }
  }

  return {
    __esModule: true,
    Animated: {
      Value: Value as unknown as typeof import('react-native').Animated.Value,
      timing: jest.fn(() => createAnimation()),
      delay: jest.fn(() => createAnimation()),
      sequence: jest.fn(() => createAnimation()),
      View: (props: any) => React.createElement('AnimatedView', props, props.children),
    },
    Easing: {
      inOut: jest.fn((fn: any) => fn),
      quad: jest.fn(),
    },
    StyleSheet: {
      create: (styles: any) => styles,
    },
    animationStartCallbacks,
  };
});

jest.mock('@hooks/useTheme', () => () => ({
  padding: { large: 8 },
  iconSize: { medium: 16 },
  colors: { headerForeground: '#000' },
}));

jest.mock('@expo/vector-icons/Ionicons', () => (props: any) =>
  React.createElement('Ionicon', props, props.children),
);

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  let indicator: ReturnType<typeof useSaveIndicator> | null = null;
  let tree: any;
  let animationStartCallbacks: Array<(status: { finished: boolean }) => void> = [];

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    indicator = null;
    animationStartCallbacks = [];
    const rnMock = jest.requireMock('react-native') as {
      animationStartCallbacks: Array<(status: { finished: boolean }) => void>;
    };
    rnMock.animationStartCallbacks.length = 0;
    jest.clearAllMocks();
  });

  test('Later show cancels completion of previous animation', ({
    given,
    when,
    then,
    and,
  }) => {
    given('save indicator is rendered', async () => {
      const TestComponent = () => {
        indicator = useSaveIndicator();
        return null;
      };

      await act(async () => {
        tree = renderWithProviders(
          <SaveIndicatorProvider>
            <SaveIndicator />
            <TestComponent />
          </SaveIndicatorProvider>,
        );
      });

      const rnMock = jest.requireMock('react-native') as {
        animationStartCallbacks: Array<(status: { finished: boolean }) => void>;
      };
      animationStartCallbacks = rnMock.animationStartCallbacks;
    });

    when('save indicator is shown twice quickly', async () => {
      await act(async () => {
        indicator!.showFor2s();
        indicator!.showFor2s();
      });
    });

    then('completing the first animation keeps it visible', async () => {
      await act(async () => {
        animationStartCallbacks[0]({ finished: true });
      });

      expect(tree.root.findAllByType('AnimatedView').length).toBe(1);
    });

    and('completing the second animation hides it', async () => {
      await act(async () => {
        animationStartCallbacks[1]({ finished: true });
      });

      expect(tree.root.findAllByType('AnimatedView').length).toBe(0);
    });
  });
});
