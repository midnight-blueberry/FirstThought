import { waitForOpaque, type OverlayTransitionCtx } from '@/components/settings/overlay/OverlayTransition';
import { OVERLAY_OPAQUE_TIMEOUT_MS } from '@/components/settings/overlay/transitionConfig';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

export default (test: JestCucumberTestFn) => {
  const originalRequestAnimationFrame = global.requestAnimationFrame;
  let overlay: OverlayTransitionCtx;
  let frameMock: jest.Mock<number, any[]>;
  let now = 0;
  let frameDuration = 16;
  let elapsed = 0;

  const setupClock = () => {
    now = 0;
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  };

  const setRequestAnimationFrame = (duration: number) => {
    frameDuration = duration;
    frameMock = jest.fn((cb: any) => {
      now += frameDuration;
      cb(now);
      return 0 as any;
    });
    global.requestAnimationFrame = frameMock as any;
  };

  const createOverlay = (isOpaqueImpl: () => boolean): OverlayTransitionCtx => ({
    begin: jest.fn(),
    end: jest.fn(),
    apply: jest.fn(),
    transact: jest.fn(),
    isBusy: jest.fn(() => false),
    freezeBackground: jest.fn(),
    releaseBackground: jest.fn(),
    isOpaque: jest.fn(isOpaqueImpl),
  });

  const measureWait = async () => {
    const start = Date.now();
    await waitForOpaque(overlay);
    elapsed = Date.now() - start;
  };

  afterEach(() => {
    global.requestAnimationFrame = originalRequestAnimationFrame;
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('resolves immediately when overlay is already opaque', ({ given, when, then }: StepDefinitions) => {
    given('overlay is already opaque', () => {
      setupClock();
      setRequestAnimationFrame(16);
      overlay = createOverlay(() => true);
    });

    when('waiting for overlay to become opaque', async () => {
      await measureWait();
    });

    then('waitForOpaque resolves without waiting for frames', () => {
      expect(overlay.isOpaque).toHaveBeenCalledTimes(1);
      expect(frameMock).not.toHaveBeenCalled();
      expect(elapsed).toBe(0);
    });
  });

  test('resolves after multiple frames when overlay becomes opaque later', ({ given, when, then }: StepDefinitions) => {
    given('overlay becomes opaque after several checks', () => {
      setupClock();
      setRequestAnimationFrame(10);
      let checks = 0;
      overlay = createOverlay(() => {
        checks += 1;
        return checks >= 4;
      });
    });

    when('waiting for overlay to become opaque', async () => {
      await measureWait();
    });

    then('waitForOpaque resolves after multiple animation frames', () => {
      expect(overlay.isOpaque).toHaveBeenCalledTimes(4);
      expect(frameMock).toHaveBeenCalledTimes(2);
      expect(elapsed).toBe(frameDuration * 2);
    });
  });

  test('resolves after timeout when overlay never becomes opaque', ({ given, when, then }: StepDefinitions) => {
    given('overlay never becomes opaque', () => {
      setupClock();
      setRequestAnimationFrame(OVERLAY_OPAQUE_TIMEOUT_MS / 4);
      overlay = createOverlay(() => false);
    });

    when('waiting for overlay to become opaque', async () => {
      await measureWait();
    });

    then('waitForOpaque resolves after overlay opaque timeout', () => {
      expect(overlay.isOpaque).toHaveBeenCalled();
      expect(frameMock).toHaveBeenCalled();
      expect(elapsed).toBeGreaterThan(OVERLAY_OPAQUE_TIMEOUT_MS);
    });
  });
};
