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
  inOut: (fn: any) => fn,
  quad: (t: number) => t,
  cubic: {},
};

class AnimatedValue {
  private _v: number;
  private _timeouts = new Set<NodeJS.Timeout>();

  constructor(v: number) {
    this._v = v;
  }

  setValue(v: number) {
    this._v = v;
  }

  getValue() {
    return this._v;
  }

  __getValue() {
    return this._v;
  }

  register(timeout: NodeJS.Timeout) {
    this._timeouts.add(timeout);
  }

  stopAnimation(cb?: (value: number) => void) {
    this._timeouts.forEach((timeout) => clearTimeout(timeout));
    this._timeouts.clear();
    cb?.(this._v);
  }
}

const timing = (value: AnimatedValue, config: { toValue: number; duration?: number }) => ({
  start: (cb?: (result?: { finished: boolean }) => void) => {
    const timeout = setTimeout(() => {
      value.setValue(config.toValue);
      cb?.({ finished: true });
    }, config.duration ?? 0);
    value.register(timeout);
  },
});

const delay = (duration: number) => ({
  start: (cb?: (result?: { finished: boolean }) => void) => {
    const timeout = setTimeout(() => cb?.({ finished: true }), duration);
    return () => clearTimeout(timeout);
  },
});

const sequence = (animations: Array<{ start: (cb?: (result?: { finished: boolean }) => void) => void }>) => ({
  start: (cb?: (result?: { finished: boolean }) => void) => {
    const runNext = (index: number) => {
      if (index >= animations.length) {
        cb?.({ finished: true });
        return;
      }

      animations[index].start(() => runNext(index + 1));
    };

    runNext(0);
  },
});

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
