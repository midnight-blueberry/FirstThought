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
  show: () => void;
  hide: () => void;
  reset: () => void;
  active: boolean;
  opacity: Animated.Value;
}

const SaveIndicatorContext =
  createContext<SaveIndicatorContextValue | undefined>(undefined);

const noopOpacity = new Animated.Value(0);
const noopContext: SaveIndicatorContextValue = {
  show: () => {},
  hide: () => {},
  reset: () => {},
  active: false,
  opacity: noopOpacity,
};

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = useCallback(() => {
    if (activeRef.current) {
      return;
    }
    activeRef.current = true;
    setActive(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const hide = useCallback(() => {
    if (!activeRef.current) {
      return;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      activeRef.current = false;
      setActive(false);
    });
  }, [opacity]);

  const reset = useCallback(() => {
    activeRef.current = false;
    opacity.stopAnimation(() => {
      opacity.setValue(0);
    });
    setActive(false);
  }, [opacity]);

  const value = useMemo(
    () => ({ show, hide, reset, active, opacity }),
    [show, hide, reset, active, opacity],
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
