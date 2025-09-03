import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import useTheme from '@hooks/useTheme';

interface OverlayTransitionCtx {
  begin: () => Promise<void>;
  end: () => Promise<void>;
  apply: (callback: () => Promise<void> | void) => Promise<void>;
  transact: (callback: () => Promise<void> | void) => Promise<void>;
  isBusy: () => boolean;
}

const OverlayTransitionContext = createContext<OverlayTransitionCtx | null>(null);

export const OverlayTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
  const busy = useRef(false);
  const theme = useTheme();

  const begin = useCallback(() => {
    setActive(true);
    return new Promise<void>(resolve => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start(() => resolve());
    });
  }, [opacity]);

  const end = useCallback(() => {
    return new Promise<void>(resolve => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setActive(false);
        resolve();
      });
    });
  }, [opacity]);

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
        await callback();
      } finally {
        await end();
        busy.current = false;
      }
    },
    [begin, end],
  );

  const isBusy = useCallback(() => busy.current, []);

  const overlayColor = theme.isDark
    ? 'rgba(255,255,255,0.35)'
    : 'rgba(0,0,0,0.35)';

  return (
    <OverlayTransitionContext.Provider value={{ begin, end, apply, transact, isBusy }}>
      {children}
      <Animated.View
        pointerEvents={active ? 'auto' : 'none'}
        style={[
          StyleSheet.absoluteFillObject,
          {
            opacity,
            backgroundColor: overlayColor,
          },
        ]}
      />
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

