import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

interface SaveIndicatorContextValue {
  showFor2s: () => Promise<void>;
  hide: () => void;
  opacity: Animated.Value;
  visible: boolean;
}

const SaveIndicatorContext = createContext<SaveIndicatorContextValue | undefined>(undefined);

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const runIdRef = useRef(0);
  const resolveRef = useRef<(() => void) | null>(null);

  const showFor2s = useCallback(() => {
    animationRef.current?.stop?.();
    resolveRef.current?.();
    resolveRef.current = null;
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    animationRef.current = null;
    setVisible(true);
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve;
      const animation = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1300),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]);

      animationRef.current = animation;
      animation.start((result) => {
        if (currentRunId !== runIdRef.current) {
          resolve();
          resolveRef.current = null;
          return;
        }

        animationRef.current = null;
        if (result?.finished !== false) {
          setVisible(false);
        }
        resolve();
        resolveRef.current = null;
      });
    });
  }, [opacity]);

  const hide = useCallback(() => {
    animationRef.current?.stop?.();
    animationRef.current = null;
    resolveRef.current?.();
    resolveRef.current = null;
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setVisible(false);
  }, [opacity]);

  const value = useMemo(
    () => ({ showFor2s, hide, opacity, visible }),
    [showFor2s, hide, opacity, visible],
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
