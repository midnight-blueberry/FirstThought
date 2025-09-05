import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing } from 'react-native';

interface SaveIndicatorContextValue {
  show: () => Promise<void>;
  reset: () => void;
  active: boolean;
  opacity: Animated.Value;
  isTransitioning: boolean;
}

const SaveIndicatorContext =
  createContext<SaveIndicatorContextValue | undefined>(undefined);

const noopOpacity = new Animated.Value(0);
const noopContext: SaveIndicatorContextValue = {
  show: () => Promise.resolve(),
  reset: () => {},
  active: false,
  opacity: noopOpacity,
  isTransitioning: false,
};

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [active, setActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setActive(false);
    setIsTransitioning(false);
  }, [opacity]);

  const show = useCallback(() => {
    if (isTransitioning) {
      return Promise.resolve();
    }
    setIsTransitioning(true);
    setActive(true);
    return new Promise<void>((resolve) => {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        hideTimeout.current = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 350,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            setActive(false);
            setIsTransitioning(false);
            hideTimeout.current = null;
            resolve();
          });
        }, 1300);
      });
    });
  }, [isTransitioning, opacity]);

  const value = useMemo(
    () => ({ show, reset, active, opacity, isTransitioning }),
    [show, reset, active, opacity, isTransitioning],
  );

  return (
    <SaveIndicatorContext.Provider value={value}>
      {children}
    </SaveIndicatorContext.Provider>
  );
};

export function useSaveIndicator(): SaveIndicatorContextValue {
  const ctx = useContext(SaveIndicatorContext);
  if (!ctx) {
    if (__DEV__) {
      throw new Error('useSaveIndicator must be used within SaveIndicatorProvider');
    }
    return noopContext;
  }
  return ctx;
}

