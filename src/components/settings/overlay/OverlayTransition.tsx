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
  const [state, setState] = useState<'idle' | 'fadingIn' | 'shown' | 'fadingOut'>('idle');
  const [modalVisible, setModalVisible] = useState(false);
  const currentAnim = useRef<Animated.CompositeAnimation | null>(null);
  const pendingPromiseRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const stopCurrentAnimation = useCallback(() => {
    currentAnim.current?.stop();
    currentAnim.current = null;
  }, []);

  const begin = useCallback(() => {
    if (state === 'shown' || state === 'fadingIn') return Promise.resolve();
    return new Promise<void>((resolve) => {
      stopCurrentAnimation();
      setModalVisible(true);
      setState('fadingIn');
      if (reduceMotion) {
        opacity.setValue(1);
        setState('shown');
        resolve();
        return;
      }
      currentAnim.current = Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      });
      currentAnim.current.start(() => {
        currentAnim.current = null;
        setState('shown');
        resolve();
      });
    });
  }, [reduceMotion, opacity, state, stopCurrentAnimation]);

  const end = useCallback(() => {
    if (state === 'idle' || state === 'fadingOut') return Promise.resolve();
    return new Promise<void>((resolve) => {
      stopCurrentAnimation();
      setState('fadingOut');
      if (reduceMotion) {
        opacity.setValue(0);
        setState('idle');
        setModalVisible(false);
        resolve();
        return;
      }
      currentAnim.current = Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      });
      currentAnim.current.start(() => {
        currentAnim.current = null;
        setState('idle');
        setModalVisible(false);
        resolve();
      });
    });
  }, [reduceMotion, opacity, state, stopCurrentAnimation]);

  const apply = useCallback(
    async (callback: () => Promise<void> | void) => {
      await begin();
      await callback();
    },
    [begin],
  );

  const transact = useCallback(
    (callback: () => Promise<void> | void) => {
      const run = async () => {
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
      };
      const next = pendingPromiseRef.current.then(run);
      pendingPromiseRef.current = next.catch(() => {});
      return next;
    },
    [begin, end],
  );

  const isBusy = useCallback(() => busy.current, []);
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

