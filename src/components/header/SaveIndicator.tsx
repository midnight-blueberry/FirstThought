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
  const fadeOutAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const pendingResolveRef = useRef<(() => void) | null>(null);
  const phaseRef = useRef<'hidden' | 'fadingIn' | 'holding' | 'fadingOut'>('hidden');
  const holdMsRef = useRef(0);

  const scheduleFadeOut = useCallback(() => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
    }
    fadeOutTimerRef.current = setTimeout(() => {
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
        if (finished) {
          setVisible(false);
          phaseRef.current = 'hidden';
        }

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

      const promise = new Promise<void>((resolve) => {
        pendingResolveRef.current = resolve;
      });

      if (phaseRef.current === 'holding' && !fadeOutAnimRef.current) {
        if (fadeOutTimerRef.current) {
          clearTimeout(fadeOutTimerRef.current);
        }
        scheduleFadeOut();
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
        scheduleFadeOut();
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
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        phaseRef.current = 'holding';
        scheduleFadeOut();
      });

      return promise;
    },
    [opacity, scheduleFadeOut],
  );

  const showFor2s = useCallback(() => showFor(2000), [showFor]);

  const hide = useCallback(() => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
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

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { opacity, right: theme.padding.large, top: theme.padding.large },
      ]}
    >
      <Ionicons
        name="save-outline"
        size={theme.iconSize.medium}
        color={theme.colors.headerForeground}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});

export default SaveIndicator;
