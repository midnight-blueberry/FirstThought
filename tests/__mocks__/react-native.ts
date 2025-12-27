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
  quad: {},
};

type AnimationCallback = (result?: { finished: boolean }) => void;

class AnimatedValue {
  private _v: number;

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

  stopAnimation(cb?: (value: number) => void) {
    cb?.(this._v);
  }
}

const timing = (value: AnimatedValue, config: any) => {
  let cb: AnimationCallback | undefined;
  let timer: NodeJS.Timeout | null = null;

  return {
    start: (startCb?: AnimationCallback) => {
      cb = startCb;
      timer = setTimeout(() => {
        value.setValue(config?.toValue ?? 0);
        cb?.({ finished: true });
      }, config?.duration ?? 0);
    },
    stop: () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      cb?.({ finished: false });
    },
  };
};

const delay = (duration: number) => {
  let cb: AnimationCallback | undefined;
  let timer: NodeJS.Timeout | null = null;

  return {
    start: (startCb?: AnimationCallback) => {
      cb = startCb;
      timer = setTimeout(() => {
        cb?.({ finished: true });
      }, duration ?? 0);
    },
    stop: () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      cb?.({ finished: false });
    },
  };
};

const sequence = (animations: Array<{ start: Function; stop?: Function }>) => {
  let index = 0;
  let stopped = false;
  let current: { start: Function; stop?: Function } | undefined;

  return {
    start: (cb?: AnimationCallback) => {
      const next = () => {
        if (stopped) {
          cb?.({ finished: false });
          return;
        }

        if (index >= animations.length) {
          cb?.({ finished: true });
          return;
        }

        current = animations[index++];
        current.start((result?: { finished: boolean }) => {
          if (result?.finished === false) {
            cb?.({ finished: false });
            return;
          }
          next();
        });
      };

      next();
    },
    stop: () => {
      stopped = true;
      current?.stop?.();
    },
  };
};

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
