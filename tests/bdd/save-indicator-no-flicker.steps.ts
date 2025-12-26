import { defineFeature, loadFeature } from 'jest-cucumber';
import { createSaveIndicatorController } from '@/components/header/saveIndicatorController';

jest.mock('react-native', () => {
  const callbacks: Array<() => void> = [];
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

  const makeCompositeAnimation = () => {
    return {
      start: (cb?: () => void) => {
        if (!cb) return;
        callbacks.push(cb);
      },
      stop: () => {},
    };
  };

  return {
    Animated: {
      Value: MockAnimatedValue,
      timing: jest.fn(makeCompositeAnimation),
      delay: jest.fn(makeCompositeAnimation),
      sequence: jest.fn(() => makeCompositeAnimation()),
    },
    Easing: {
      inOut: (fn: unknown) => fn,
      quad: 'quad',
    },
    __esModule: true,
    __callbacks: callbacks,
  };
});

const getCallbacks = () => jest.requireMock('react-native').__callbacks as Array<() => void>;

const feature = loadFeature('tests/bdd/save-indicator-no-flicker.feature');

defineFeature(feature, (test) => {
  let controller: ReturnType<typeof createSaveIndicatorController> | null = null;
  let setVisible: jest.Mock;
  let firstRunPromise: Promise<void> | null = null;
  let secondRunPromise: Promise<void> | null = null;

  beforeEach(() => {
    const callbacks = getCallbacks();
    callbacks.splice(0, callbacks.length);
    setVisible = jest.fn();
    controller = createSaveIndicatorController({
      setVisible,
      // @ts-ignore
      opacity: new (jest.requireMock('react-native').Animated.Value)(0),
    });
  });

  afterEach(() => {
    controller = null;
    firstRunPromise = null;
    secondRunPromise = null;
    jest.clearAllMocks();
  });

  test('Sequential show calls do not hide indicator from earlier completion', ({ given, when, then, and }) => {
    given('a save indicator controller', () => {
      expect(controller).not.toBeNull();
    });

    when('show is triggered twice quickly', () => {
      firstRunPromise = controller!.showFor2s();
      secondRunPromise = controller!.showFor2s();
    });

    and('the first animation completes', async () => {
      const callbacks = getCallbacks();
      const [firstCallback] = callbacks;
      expect(firstCallback).toBeDefined();
      firstCallback();
      await firstRunPromise;
    });

    then('the indicator is still visible', () => {
      const falseCalls = setVisible.mock.calls.filter(([value]) => value === false);
      expect(falseCalls).toHaveLength(0);
    });

    when('the second animation completes', async () => {
      const callbacks = getCallbacks();
      const [, secondCallback] = callbacks;
      expect(secondCallback).toBeDefined();
      secondCallback();
      await secondRunPromise;
    });

    then('the indicator is hidden', () => {
      const falseCalls = setVisible.mock.calls.filter(([value]) => value === false);
      expect(falseCalls).toHaveLength(1);
    });
  });
});
