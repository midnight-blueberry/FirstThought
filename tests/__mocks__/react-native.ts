// Лёгкий shim RN для unit-тестов
export const AccessibilityInfo = {
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};
export const StyleSheet = { create: (s: any) => s };
export const InteractionManager = {
  runAfterInteractions: () => Promise.resolve(),
};
export const Easing = {
  inOut: (_: any) => (_t: any) => {},
  quad: {},
  cubic: {},
};

type AnimationCallback = (result?: { finished: boolean }) => void;

class AnimatedValue {
  private _v: number;
  constructor(v: number) { this._v = v; }
  setValue(v: number) { this._v = v; }
  getValue() { return this._v; }
  stopAnimation(cb?: (value: number) => void) { cb?.(this._v); }
}

class MockAnimation {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private cb: AnimationCallback | undefined;
  private stopped = false;

  constructor(
    private readonly duration: number,
    private readonly onComplete?: () => void,
  ) {}

  start(cb?: AnimationCallback) {
    this.cb = cb;
    this.timer = setTimeout(() => {
      if (this.stopped) return;
      this.onComplete?.();
      this.cb?.({ finished: true });
    }, this.duration);
  }

  stop() {
    this.stopped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.cb?.({ finished: false });
  }
}

function timing(value: AnimatedValue, config: any) {
  const toValue = config?.toValue;
  const duration = config?.duration ?? 0;
  return new MockAnimation(duration, () => {
    if (typeof toValue === 'number') {
      value.setValue(toValue);
    }
  });
}

function delay(ms: number) {
  return new MockAnimation(ms ?? 0);
}

function sequence(anims: MockAnimation[]) {
  let index = 0;

  return {
    start: (cb?: AnimationCallback) => {
      index = 0;
      const runNext = () => {
        if (index >= anims.length) {
          cb?.({ finished: true });
          return;
        }
        const current = anims[index];
        index += 1;
        current.start((result) => {
          if (result?.finished === false) {
            cb?.({ finished: false });
            return;
          }
          runNext();
        });
      };
      runNext();
    },
    stop: () => {
      const currentIndex = Math.min(Math.max(index - 1, 0), anims.length - 1);
      anims[currentIndex]?.stop();
    },
  };
}

export const Animated = {
  Value: AnimatedValue,
  timing,
  delay,
  sequence,
};

export default {
  AccessibilityInfo,
  StyleSheet,
  InteractionManager,
  Animated,
  Easing,
};
