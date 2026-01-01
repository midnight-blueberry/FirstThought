import React from 'react';

// Лёгкий shim RN для unit-тестов
export const __mock = {
  views: [] as any[],
};

export const AccessibilityInfo = {
  addEventListener: () => ({ remove: () => {} }),
  removeEventListener: () => {},
};
export const StyleSheet: any = { create: (s: any) => s };
StyleSheet.flatten = (style: any) => {
  if (!Array.isArray(style)) {
    return style;
  }

  return style.reduce((acc, item) => ({ ...acc, ...(item || {}) }), {});
};
export const InteractionManager = {
  runAfterInteractions: () => Promise.resolve(),
};
export const UIManager = {
  measureLayout: jest.fn(),
};
export const Easing = {
  inOut: (_: any) => (_t: any) => {},
  cubic: {},
};

export function findNodeHandle(ref: any): number | null {
  if (ref == null) return null;
  if (typeof ref === 'number') return ref;

  return 1;
}

export const Platform = {
  OS: 'ios',
  select: (options: Record<string, any>) => options.ios,
};

export const ToastAndroid = {
  SHORT: 'short',
  show: jest.fn(),
};

export const Alert = {
  alert: jest.fn(),
};

const recordView = (type: string, props: any) => {
  __mock.views.push({ type, props });
  return props;
};

export const View = (props: any) =>
  React.createElement('div', recordView('View', { style: props.style }), props.children);
export const TouchableOpacity = (props: any) =>
  React.createElement('div', recordView('TouchableOpacity', { style: props.style }), props.children);

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
  __mock,
  StyleSheet,
  InteractionManager,
  UIManager,
  Animated,
  Easing,
  Platform,
  ToastAndroid,
  Alert,
  View,
  TouchableOpacity,
  findNodeHandle,
};
