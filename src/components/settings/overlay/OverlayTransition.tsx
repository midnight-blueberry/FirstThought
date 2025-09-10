import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Easing } from 'react-native';
import { Portal } from 'react-native-portalize';
import useTheme from '@hooks/useTheme';

export interface OverlayTransitionCtx {
  begin: () => Promise<void>;
  end: () => Promise<void>;
  apply: (callback: () => Promise<void> | void) => Promise<void>;
  transact: (callback: () => Promise<void> | void) => Promise<void>;
  isBusy: () => boolean;
  freezeBackground: (color: string) => void;
  releaseBackground: () => void;
  isOpaque: () => boolean;
}

const OverlayTransitionContext = createContext<OverlayTransitionCtx | null>(null);

export const waitFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export const waitForOpaque = (overlay: OverlayTransitionCtx) =>
  new Promise<void>((resolve) => {
    if (overlay.isOpaque()) {
      resolve();
      return;
    }
    const start = Date.now();
    const check = () => {
      if (overlay.isOpaque() || Date.now() - start > 300) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

export const OverlayTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const busy = useRef(false);
  const theme = useTheme();
  const [frozenBg, setFrozenBg] = useState<string | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const begin = useCallback(() => {
    setActive(true);
    return new Promise<void>((resolve) => {
      if (reduceMotion) {
        opacity.setValue(1);
        resolve();
      } else {
        const timing = Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        });
        timing.start(({ finished: _finished }) => resolve());
      }
    });
  }, [opacity, reduceMotion]);

  const end = useCallback(() => {
    return new Promise<void>(resolve => {
      if (reduceMotion) {
        opacity.setValue(0);
        setActive(false);
        resolve();
      } else {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
          setActive(false);
          resolve();
        });
      }
    });
  }, [opacity, reduceMotion]);

  const apply = useCallback(
    async (callback: () => Promise<void> | void) => {
      await begin();
      await callback();
    },
    [begin],
  );

  const transact = useCallback(
    async (callback: () => Promise<void> | void) => {
      if (busy.current) return;
      busy.current = true;
      try {
        await begin();
        await waitFrame();
        await callback();
        await waitFrame();
      } finally {
        await end();
        busy.current = false;
        setFrozenBg(null);
      }
    },
    [begin, end],
  );

  const isBusy = useCallback(() => busy.current, []);

  const animatedStyle = { opacity };

  return (
    <OverlayTransitionContext.Provider
      value={{
        begin,
        end,
        apply,
        transact,
        isBusy,
        freezeBackground: setFrozenBg,
        releaseBackground: () => setFrozenBg(null),
        isOpaque: () => (opacity as any).__getValue() >= 1,
      }}
    >
      {children}
      <Portal>
        <Animated.View
          pointerEvents={active ? 'auto' : 'none'}
          style={[
            styles.overlay,
            { backgroundColor: frozenBg ?? theme.colors.background },
            animatedStyle,
          ]}
        />
      </Portal>
    </OverlayTransitionContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
});

export function useOverlayTransition() {
  const ctx = useContext(OverlayTransitionContext);
  if (!ctx) {
    throw new Error('useOverlayTransition must be used within OverlayTransitionProvider');
  }
  return ctx;
}

