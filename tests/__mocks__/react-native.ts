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

export const Dimensions = {
  get: jest.fn(() => ({ width: 0, height: 0 })),
};

const recordView = (type: string, props: any) => {
  __mock.views.push({ type, props });
  return props;
};

export const View = (props: any) =>
  React.createElement('div', recordView('View', { style: props.style }), props.children);
export const Text = (props: any) => {
  recordView('Text', {
    style: props.style,
    maxFontSizeMultiplier: props.maxFontSizeMultiplier,
  });
  return React.createElement('div', null, props.children);
};
export const TextInput = (props: any) =>
  React.createElement('div', recordView('TextInput', { style: props.style }), props.children);
export const TouchableOpacity = (props: any) => {
  const recordedProps = {
    style: props.style,
    onPress: props.onPress,
    onPressIn: props.onPressIn,
    hitSlop: props.hitSlop,
    disabled: props.disabled,
    testID: props.testID,
  };
  recordView('TouchableOpacity', recordedProps);
  return React.createElement('div', { style: props.style }, props.children);
};
export const Pressable = (props: any) => {
  const flattenedStyle = StyleSheet.flatten(props.style);
  const role = props.accessibilityRole;
  const ariaDisabled = props.disabled === true || props.accessibilityState?.disabled === true;
  const domProps: Record<string, any> = {
    style: flattenedStyle,
  };

  if (role) {
    domProps.role = role;
  }

  if (ariaDisabled) {
    domProps['aria-disabled'] = true;
  }

  if (props.testID) {
    domProps['data-testid'] = props.testID;
  }

  recordView('Pressable', {
    style: props.style,
    disabled: props.disabled,
    accessibilityRole: props.accessibilityRole,
    accessibilityState: props.accessibilityState,
    testID: props.testID,
  });

  return React.createElement('div', domProps, props.children);
};
export const StatusBar = (props: any) => {
  recordView('StatusBar', props);
  return React.createElement('div', null);
};

class AnimatedValue {
  private _v: number;
  constructor(v: number) { this._v = v; }
  setValue(v: number) { this._v = v; }
  getValue() { return this._v; }
  stopAnimation(cb?: (value?: number) => void) {
    if (cb) cb(this._v);
  }
}
export const Animated = {
  Value: AnimatedValue,
  timing: jest.fn((_: any, __: any) => ({ start: jest.fn((cb?: () => void) => { if (cb) cb(); }) })),
  sequence: jest.fn((animations: any[]) => ({ animations })),
  loop: jest.fn((animation: any, config?: any) => ({
    animation,
    config,
    start: jest.fn((cb?: () => void) => { if (cb) cb(); }),
  })),
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
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StatusBar,
  findNodeHandle,
};
