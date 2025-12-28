import { Easing } from 'react-native';

export const OVERLAY_SHOW_DURATION_MS = 500;
export const OVERLAY_HIDE_DURATION_MS = 500;
export const OVERLAY_MAX_OPACITY = 1;
export const OVERLAY_MIN_OPACITY = 0;
export const OVERLAY_EASING_IN = Easing.inOut(Easing.cubic);
export const OVERLAY_EASING_OUT = Easing.inOut(Easing.cubic);
export const OVERLAY_OPAQUE_TIMEOUT_MS = 300;
export const OVERLAY_POINTER_EVENTS_THRESHOLD = 0.75;

export function getOverlayPointerEvents(opacity: number): 'auto' | 'none' {
  return opacity > OVERLAY_POINTER_EVENTS_THRESHOLD ? 'auto' : 'none';
}
