import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

interface SaveIndicatorContextValue {
  showFor: (durationMs: number) => Promise<void>;
  showFor2s: () => Promise<void>;
  hide: () => void;
  opacity: Animated.Value;
  visible: boolean;
}

const SaveIndicatorContext = createContext<SaveIndicatorContextValue | undefined>(undefined);

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeInAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const fadeOutAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pendingResolveRef = useRef<(() => void) | null>(null);
  const requestIdRef = useRef(0);
  const phaseRef = useRef<'hidden' | 'fadingIn' | 'holding' | 'fadingOut'>('hidden');
  const holdMsRef = useRef(0);

  const scheduleFadeOut = useCallback((requestId: number) => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
    }

    fadeOutTimerRef.current = setTimeout(() => {
      if (requestId !== requestIdRef.current) {
        return;
      }

      fadeOutTimerRef.current = null;
      phaseRef.current = 'fadingOut';
      fadeOutAnimRef.current = Animated.timing(opacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      });

      fadeOutAnimRef.current.start(({ finished }) => {
        fadeOutAnimRef.current = null;
        if (!finished || requestId !== requestIdRef.current) {
          return;
        }

        setVisible(false);
        phaseRef.current = 'hidden';

        if (pendingResolveRef.current) {
          pendingResolveRef.current();
          pendingResolveRef.current = null;
        }
      });
    }, holdMsRef.current);
  }, [opacity]);

  const showFor = useCallback(
    (durationMs: number) => {
      if (pendingResolveRef.current) {
        pendingResolveRef.current();
        pendingResolveRef.current = null;
      }

      holdMsRef.current = durationMs;
      const requestId = ++requestIdRef.current;

      const promise = new Promise<void>((resolve) => {
        pendingResolveRef.current = resolve;
      });

      if (phaseRef.current === 'holding' && !fadeOutAnimRef.current) {
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current);
        }

        scheduleFadeOut(requestId);
        return promise;
      }

      if (phaseRef.current === 'fadingIn') {
        if (fadeInAnimRef.current) {
          fadeInAnimRef.current.stop();
          fadeInAnimRef.current = null;
        }

        opacity.stopAnimation(() => {
          opacity.setValue(1);
        });
        phaseRef.current = 'holding';
        setVisible(true);
        scheduleFadeOut(requestId);
        return promise;
      }

      if (phaseRef.current === 'fadingOut') {
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current);
          fadeOutTimerRef.current = null;
        }

        if (fadeOutAnimRef.current) {
          fadeOutAnimRef.current.stop();
          fadeOutAnimRef.current = null;
        }

        opacity.stopAnimation(() => {
          opacity.setValue(1);
        });
        phaseRef.current = 'holding';
        setVisible(true);
        scheduleFadeOut(requestId);
        return promise;
      }

      if (fadeOutTimerRef.current) {
        clearTimeout(fadeOutTimerRef.current);
        fadeOutTimerRef.current = null;
      }

      if (fadeOutAnimRef.current) {
        fadeOutAnimRef.current.stop();
        fadeOutAnimRef.current = null;
      }

      setVisible(true);
      phaseRef.current = 'fadingIn';
      fadeInAnimRef.current = Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      });

      fadeInAnimRef.current.start(({ finished }) => {
        fadeInAnimRef.current = null;
        if (!finished || requestId !== requestIdRef.current) {
          return;
        }

        phaseRef.current = 'holding';
        scheduleFadeOut(requestId);
      });

      return promise;
    },
    [opacity, scheduleFadeOut],
  );

  const showFor2s = useCallback(() => showFor(2000), [showFor]);

  const hide = useCallback(() => {
    requestIdRef.current += 1;

    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }

    if (fadeInAnimRef.current) {
      fadeInAnimRef.current.stop();
      fadeInAnimRef.current = null;
    }

    if (fadeOutAnimRef.current) {
      fadeOutAnimRef.current.stop();
      fadeOutAnimRef.current = null;
    }

    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setVisible(false);
    phaseRef.current = 'hidden';

    if (pendingResolveRef.current) {
      pendingResolveRef.current();
      pendingResolveRef.current = null;
    }
  }, [opacity]);

  const value = useMemo(
    () => ({ showFor, showFor2s, hide, opacity, visible }),
    [showFor, showFor2s, hide, opacity, visible],
  );

  return <SaveIndicatorContext.Provider value={value}>{children}</SaveIndicatorContext.Provider>;
};

export function useSaveIndicator() {
  const ctx = useContext(SaveIndicatorContext);
  if (!ctx) {
    throw new Error('useSaveIndicator must be used within SaveIndicatorProvider');
  }

  return ctx;
}

const SaveIndicator: React.FC = () => {
  const { visible, opacity } = useSaveIndicator();
  const theme = useTheme();

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: visible ? opacity : 0,
          width: theme.buttonSizes.small,
          height: theme.buttonSizes.small,
        },
      ]}
    >
      <Ionicons
        name="save-outline"
        size={theme.iconSize.large}
        color={theme.colors.headerForeground}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SaveIndicator;
