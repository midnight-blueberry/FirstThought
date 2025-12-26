import { defineFeature, loadFeature } from 'jest-cucumber';
import { createSaveIndicatorController } from '@/components/header/saveIndicatorController';

jest.mock('react-native', () => {
  const startCallbacks: Array<() => void> = [];

  class MockAnimatedValue {
    private value: number;
    constructor(initial: number) {
      this.value = initial;
    }

    setValue(next: number) {
      this.value = next;
    }

    stopAnimation(cb?: (value: number) => void) {
      cb?.(this.value);
    }
  }

  return {
    Animated: {
      Value: MockAnimatedValue,
      timing: jest.fn(() => ({ stop: jest.fn() })),
      delay: jest.fn(() => ({ stop: jest.fn() })),
      sequence: jest.fn(() => ({
        start: (cb?: () => void) => {
          if (cb) {
            startCallbacks.push(cb);
          }
        },
        stop: jest.fn(),
      })),
    },
    Easing: { inOut: jest.fn((e) => e), quad: 'quad' },
    StyleSheet: { create: (styles: any) => styles },
    __startCallbacks: startCallbacks,
  };
});

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  test('Previous animation completion cannot hide indicator after a new show', ({
    given,
    when,
    then,
  }) => {
    let controller: ReturnType<typeof createSaveIndicatorController> | null = null;
    let setVisible: jest.Mock;
    let startCallbacks: Array<() => void> = [];

    given('save indicator controller is initialized', () => {
      setVisible = jest.fn();
      const { Animated, __startCallbacks } = jest.requireMock('react-native');
      startCallbacks = __startCallbacks;
      const opacity = new Animated.Value(0);

      controller = createSaveIndicatorController({ setVisible, opacity });
    });

    when('save indicator is shown twice in a row', () => {
      controller!.showFor2s();
      controller!.showFor2s();
    });

    when('the first animation completes', () => {
      const first = startCallbacks.shift();
      first?.();
    });

    then('the indicator is still visible', () => {
      expect(setVisible).not.toHaveBeenCalledWith(false);
    });

    when('the second animation completes', () => {
      const second = startCallbacks.shift();
      second?.();
    });

    then('the indicator becomes hidden', () => {
      expect(setVisible).toHaveBeenCalledWith(true);
      expect(setVisible).toHaveBeenCalledWith(false);
    });
  });
});
