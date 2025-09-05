import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, Easing, Modal } from 'react-native';
import useTheme from '@hooks/useTheme';

interface OverlayTransitionCtx {
  begin: () => Promise<void>;
  end: () => Promise<void>;
  apply: (callback: () => Promise<void> | void) => Promise<void>;
  transact: (callback: () => Promise<void> | void) => Promise<void>;
  isBusy: () => boolean;
  freezeBackground: (color: string) => void;
  releaseBackground: () => void;
}

const OverlayTransitionContext = createContext<OverlayTransitionCtx | null>(null);

export const waitFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export const OverlayTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const busy = useRef(false);
  const theme = useTheme();
  const [frozenBg, setFrozenBg] = useState<string | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const begin = useCallback(() => {
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
        resolve();
      } else {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }).start(() => {
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

  useEffect(() => {
    const id = opacity.addListener(({ value }) => setIsOverlayVisible(value > 0.001));
    return () => opacity.removeListener(id);
  }, [opacity]);

  const modalVisible = isOverlayVisible || busy.current;
  const bg = frozenBg ?? theme.colors.background;

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
      }}
    >
      {children}
      <Modal transparent visible={modalVisible} statusBarTranslucent>
        <Animated.View
          pointerEvents={isOverlayVisible ? 'auto' : 'none'}
          style={[StyleSheet.absoluteFill, { backgroundColor: bg, opacity }]}
        />
      </Modal>
    </OverlayTransitionContext.Provider>
  );
};

export function useOverlayTransition() {
  const ctx = useContext(OverlayTransitionContext);
  if (!ctx) {
    throw new Error('useOverlayTransition must be used within OverlayTransitionProvider');
  }
  return ctx;
}

