import { waitFrame } from '@/components/settings/overlay/OverlayTransition';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  const originalRequestAnimationFrame = global.requestAnimationFrame;
  let rafMock: jest.Mock<number, [FrameRequestCallback]>;
  let rafCallback: FrameRequestCallback | null;
  let promise: Promise<void>;
  let resolved = false;

  const mockRequestAnimationFrame = () => {
    rafCallback = null;
    rafMock = jest.fn((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 0 as any;
    });
    global.requestAnimationFrame = rafMock as any;
  };

  afterEach(() => {
    global.requestAnimationFrame = originalRequestAnimationFrame;
    rafCallback = null;
    jest.clearAllMocks();
  });

  test('waitFrame calls requestAnimationFrame once', ({ given, when, then }: StepDefinitions) => {
    given('requestAnimationFrame is mocked for waitFrame', () => {
      mockRequestAnimationFrame();
    });

    when('waitFrame is invoked', () => {
      promise = waitFrame();
    });

    then('requestAnimationFrame is called exactly once', async () => {
      expect(rafMock).toHaveBeenCalledTimes(1);
      rafCallback?.(0 as any);
      await promise;
    });
  });

  test('waitFrame resolves after animation frame callback', ({ given, when, then }: StepDefinitions) => {
    given('requestAnimationFrame is mocked for waitFrame', () => {
      mockRequestAnimationFrame();
    });

    when('waitFrame promise is created without firing callback', async () => {
      resolved = false;
      promise = waitFrame().then(() => {
        resolved = true;
      });
      await Promise.resolve();
    });

    then('promise resolves only after manually invoking the animation frame callback', async () => {
      expect(resolved).toBe(false);
      rafCallback?.(0 as any);
      await promise;
      expect(resolved).toBe(true);
    });
  });
};
