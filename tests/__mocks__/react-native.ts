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
  cubic: {},
};

class AnimatedValue {
  private _v: number;
  constructor(v: number) { this._v = v; }
  setValue(v: number) { this._v = v; }
  getValue() { return this._v; }
  __getValue() { return this._v; }
  stopAnimation(cb?: (v: number) => void) { if (cb) cb(this._v); }
}
export const Animated = {
  Value: AnimatedValue,
  timing: (value: AnimatedValue, config: any) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return {
      start: (cb?: (result?: { finished: boolean }) => void) => {
        timeout = setTimeout(() => {
          value.setValue(config?.toValue ?? value.getValue());
          cb?.({ finished: true });
        }, config?.duration ?? 0);
      },
      stop: () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
        }
      },
    };
  },
  delay: (duration: number) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    return {
      start: (cb?: (result?: { finished: boolean }) => void) => {
        timeout = setTimeout(() => cb?.({ finished: true }), duration ?? 0);
      },
      stop: () => {
        if (timeout !== undefined) {
          clearTimeout(timeout);
          timeout = undefined;
        }
      },
    };
  },
  sequence: (animations: any[]) => {
    let current = 0;
    let stopped = false;
    let currentStop: (() => void) | undefined;

    const start = (cb?: (result?: { finished: boolean }) => void) => {
      const runNext = () => {
        if (stopped) return;
        if (current >= animations.length) {
          cb?.({ finished: true });
          return;
        }

        const animation = animations[current];
        currentStop = animation.stop?.bind(animation);
        animation.start((result?: { finished: boolean }) => {
          if (stopped) return;
          current += 1;
          if (result?.finished === false) {
            cb?.(result);
            return;
          }
          runNext();
        });
      };

      runNext();
    };

    const stop = () => {
      stopped = true;
      currentStop?.();
    };

    return { start, stop };
  },
};

export default {
  AccessibilityInfo,
  StyleSheet,
  InteractionManager,
  Animated,
  Easing,
};
