import React from 'react';
import { Animated, View } from 'react-native';
// @ts-ignore
import { act } from 'react-test-renderer';

import SaveIndicator, { SaveIndicatorProvider, useSaveIndicator } from '@/components/header/SaveIndicator';
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
  let manualFadeOutCompletion = false;
  let fadeOutStops: jest.Mock[] = [];
  let opacitySetValueSpy: jest.SpyInstance | null = null;
  let fadeInConfigsBeforeSecondShow: number | null = null;

  const Capture = () => {
    context = useSaveIndicator();
    return null;
  };

  const renderProvider = () => {
    tree = renderWithProviders(
      React.createElement(
        View,
        null,
        React.createElement(
          SaveIndicatorProvider,
          null,
          React.createElement(
            React.Fragment,
            null,
            React.createElement(SaveIndicator, null),
            React.createElement(Capture, null),
          ),
        ),
      ),
    );
  };

  beforeAll(() => {
    const valuePrototype = (Animated.Value as unknown as { prototype: Animated.Value }).prototype as any;
    if (typeof valuePrototype.stopAnimation !== 'function') {
      valuePrototype.stopAnimation = function stopAnimation(callback?: (value: number) => void) {
        callback?.(this._value ?? 0);
      };
    }
  });

  beforeEach(() => {
    jest.useFakeTimers();
    manualFadeOutCompletion = false;
    fadeOutStops = [];
    opacitySetValueSpy = null;
    fadeInConfigsBeforeSecondShow = null;
    timingConfigs = [];
    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    timingSpy = jest.spyOn(Animated, 'timing').mockImplementation((value: any, config: TimingConfig) => {
      timingConfigs.push(config);
      const stop = jest.fn();
      const start = jest.fn((callback?: (result: { finished: boolean }) => void) => {
        if (config?.toValue === 0 && manualFadeOutCompletion) {
          return;
        }

        callback?.({ finished: true });
      });

      if (config?.toValue === 0) {
        fadeOutStops.push(stop);
      }

      return { start, stop, reset: jest.fn() } as unknown as Animated.CompositeAnimation;
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
    fadeOutStops = [];
    opacitySetValueSpy?.mockRestore();
    fadeInConfigsBeforeSecondShow = null;
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

  test('save indicator component is visible only while showing', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    then('the save indicator icon is not rendered', () => {
      expect(tree!.root.findAllByType('Ionicons')).toHaveLength(0);
    });

    when('showFor is called with 1000 milliseconds to display the icon', async () => {
      await act(async () => {
        firstPromise = context!.showFor(1000);
        expect(tree!.root.findAllByType('Ionicons')).toHaveLength(1);
      });
    });

    then('the save indicator icon is rendered', () => {
      expect(tree!.root.findAllByType('Ionicons')).toHaveLength(1);
    });

    when('1000 milliseconds elapse', async () => {
      await act(async () => {
        jest.advanceTimersByTime(1000);
        expect(tree!.root.findAllByType('Ionicons')).toHaveLength(0);
      });
    });

    then('the save indicator icon is not rendered anymore', () => {
      expect(tree!.root.findAllByType('Ionicons')).toHaveLength(0);
    });
  });

  test('showFor2s schedules fade out for 2000 milliseconds', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    when('showFor2s is called', async () => {
      await act(async () => {
        firstPromise = context!.showFor2s();
      });
    });

    then('a fade-out timer is scheduled for 2000 milliseconds', () => {
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 2000);
      expect(jest.getTimerCount()).toBe(1);
    });

    then('the returned promise resolves after 2000 milliseconds elapse', async () => {
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      await expect(firstPromise).resolves.toBeUndefined();
    });
  });

  test('showFor during active fade-out stops animation and reschedules hold', ({ given, when, then }: StepDefinitions) => {
    given('the save indicator provider is rendered', () => {
      expect(context).not.toBeNull();
    });

    given('fade-out completion is handled manually', () => {
      manualFadeOutCompletion = true;
    });

    when('showFor is called with 1000 milliseconds', async () => {
      await act(async () => {
        firstPromise = context!.showFor(1000);
      });

      fadeInConfigsBeforeSecondShow = timingConfigs.filter((config) => config?.toValue === 1).length;
    });

    when('the fade-out timer elapses while the fade-out animation keeps running', async () => {
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });

      expect(fadeOutStops[0]).toBeDefined();
      expect(fadeOutStops[0]).not.toHaveBeenCalled();
    });

    when('showFor is called again with 2000 milliseconds during fade-out', async () => {
      opacitySetValueSpy = jest.spyOn(context!.opacity, 'setValue');

      await act(async () => {
        secondPromise = context!.showFor(2000);
      });
    });

    then('the in-flight fade-out animation is stopped and opacity resets to 1', () => {
      expect(fadeOutStops[0]).toHaveBeenCalledTimes(1);
      expect(opacitySetValueSpy).toHaveBeenCalledWith(1);
    });

    then('a single fade-out timer is active for 2000 milliseconds', () => {
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), 2000);
      expect(jest.getTimerCount()).toBe(1);
    });

    then('no additional fade-in animation is triggered', () => {
      const fadeInCalls = timingConfigs.filter((config) => config?.toValue === 1);
      expect(fadeInCalls).toHaveLength(fadeInConfigsBeforeSecondShow!);
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
