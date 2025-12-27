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

export const UIManager = {
  measureLayout: (
    _target: any,
    _relativeTo: any,
    _onFail: () => void,
    onSuccess: (x: number, y: number) => void,
  ) => {
    if (typeof onSuccess === 'function') {
      onSuccess(0, 0);
    }
  },
};

export const findNodeHandle = (ref: any) => ref?.nodeHandle ?? ref ?? 1;

export class ScrollView {
  scrollTo = (_: any) => {};
}

class AnimatedValue {
  private _v: number;
  constructor(v: number) { this._v = v; }
  setValue(v: number) { this._v = v; }
  getValue() { return this._v; }
}
export const Animated = {
  Value: AnimatedValue,
  timing: (_: any, __: any) => ({ start: (cb?: () => void) => { if (cb) cb(); } }),
};

export default {
  AccessibilityInfo,
  StyleSheet,
  InteractionManager,
  Animated,
  Easing,
  UIManager,
  findNodeHandle,
  ScrollView,
};
