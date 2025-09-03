import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import useTheme from '@hooks/useTheme';

interface OverlayTransitionCtx {
  begin: () => Promise<void>;
  end: () => Promise<void>;
}

const OverlayTransitionContext = createContext<OverlayTransitionCtx | null>(null);

export const OverlayTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
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

  // step 2 will implement fade-out; placeholder for now
  const end = useCallback(async () => {}, []);

  const overlayColor = theme.isDark
    ? 'rgba(255,255,255,0.35)'
    : 'rgba(0,0,0,0.35)';

  return (
    <OverlayTransitionContext.Provider value={{ begin, end }}>
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

