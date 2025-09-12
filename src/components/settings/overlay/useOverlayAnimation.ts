import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import {
  OVERLAY_EASING_IN,
  OVERLAY_EASING_OUT,
  OVERLAY_HIDE_DURATION_MS,
  OVERLAY_MAX_OPACITY,
  OVERLAY_MIN_OPACITY,
  OVERLAY_SHOW_DURATION_MS,
} from './transitionConfig';

export type OverlayAnimationApi = {
  opacity: Animated.Value;
  show: () => void;
  hide: () => void;
};

export function useOverlayAnimation(): OverlayAnimationApi {
  const opacity = useRef(new Animated.Value(OVERLAY_MIN_OPACITY)).current;

  const show = useCallback(() => {
    Animated.timing(opacity, {
      toValue: OVERLAY_MAX_OPACITY,
      duration: OVERLAY_SHOW_DURATION_MS,
      easing: OVERLAY_EASING_IN,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: OVERLAY_MIN_OPACITY,
      duration: OVERLAY_HIDE_DURATION_MS,
      easing: OVERLAY_EASING_OUT,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return { opacity, show, hide };
}

