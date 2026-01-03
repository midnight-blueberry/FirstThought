import React from 'react';
import { Animated } from 'react-native';
// @ts-ignore
import { act } from 'react-test-renderer';

import { SaveIndicatorProvider, useSaveIndicator } from '@/components/header/SaveIndicator';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import { renderWithProviders } from '@tests/utils/render';
import { unmountTree } from '@tests/utils/unmountTree';

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');

jest.mock('@hooks/useTheme', () => () => ({
  padding: { large: 16 },
  iconSize: { medium: 24 },
  colors: { headerForeground: '#000' },
}));

type TimingConfig = Parameters<typeof Animated.timing>[1];

type ContextValue = ReturnType<typeof useSaveIndicator> | null;

export default (test: JestCucumberTestFn) => {
  let tree: ReturnType<typeof renderWithProviders> | null = null;
  let context: ContextValue = null;
  let firstPromise: Promise<void> | null = null;
  let secondPromise: Promise<void> | null = null;
  let timingSpy: jest.SpyInstance;
  let setTimeoutSpy: jest.SpyInstance;
  let timingConfigs: TimingConfig[] = [];

  const Capture = () => {
    context = useSaveIndicator();
    return null;
  };

  const renderProvider = () => {
    tree = renderWithProviders(
      React.createElement(
        SaveIndicatorProvider,
        null,
        React.createElement(Capture, null),
      ),
    );
  };

  beforeAll(() => {
    const valuePrototype = (Animated.Value as unknown as { prototype: Animated.Value }).prototype as any;
    if (typeof valuePrototype.stopAnimation !== 'function') {
      // eslint-disable-next-line no-param-reassign
      valuePrototype.stopAnimation = function stopAnimation(callback?: (value: number) => void) {
        callback?.(this._value ?? 0);
      };
    }
  });

  beforeEach(() => {
    jest.useFakeTimers();
    timingConfigs = [];
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    timingSpy = jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: TimingConfig) => {
      timingConfigs.push(config);
      const start = jest.fn((callback?: (result: { finished: boolean }) => void) => {
        callback?.({ finished: true });
      });

      return {
        start,
        stop: jest.fn(),
        reset: jest.fn(),
      } as unknown as Animated.CompositeAnimation;
    });

    renderProvider();
  });

  afterEach(async () => {
    timingSpy?.mockRestore();
    setTimeoutSpy?.mockRestore();
    context = null;
    firstPromise = null;
    secondPromise = null;
    timingConfigs = [];
    tree = await unmountTree(tree);
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('showFor schedules fade out and resolves after duration', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    when('showFor is called with 1000 milliseconds', async () => {
      await act(async () => {
        firstPromise = context!.showFor(1000);
      });
    });

    then('a fade-out timer is scheduled for 1000 milliseconds', () => {
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
      expect(jest.getTimerCount()).toBe(1);
    });

    then('the returned promise resolves after 1000 milliseconds elapse', async () => {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      await expect(firstPromise).resolves.toBeUndefined();
    });
  });

  test('subsequent showFor reschedules fade out without extra fade-in', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    when('showFor is called with 1000 milliseconds', async () => {
      await act(async () => {
        firstPromise = context!.showFor(1000);
      });
    });

    when('showFor is called again with 2000 milliseconds before the first timeout', async () => {
      await act(async () => {
        secondPromise = context!.showFor(2000);
      });
    });

    then('the first promise resolves immediately', async () => {
      await expect(firstPromise).resolves.toBeUndefined();
    });

    then('the fade-out timer is rescheduled for 2000 milliseconds', () => {
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 1000);
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 2000);
      expect(jest.getTimerCount()).toBe(1);
      expect(secondPromise).not.toBeNull();
    });

    then('the fade-in animation is triggered only once', () => {
      const fadeInCalls = timingConfigs.filter((config) => config?.toValue === 1);
      expect(fadeInCalls).toHaveLength(1);
    });
  });

  test('hide resolves promise and clears timers', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    when('showFor is called with 1500 milliseconds', async () => {
      await act(async () => {
        firstPromise = context!.showFor(1500);
      });
    });

    when('hide is called', async () => {
      await act(async () => {
        context!.hide();
      });
    });

    then('the current promise resolves immediately', async () => {
      await expect(firstPromise).resolves.toBeUndefined();
    });

    then('no fade-out timers remain active', () => {
      expect(jest.getTimerCount()).toBe(0);
    });
  });
};
