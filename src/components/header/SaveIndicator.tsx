import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

interface SaveIndicatorContextValue {
  show: () => Promise<void>;
  reset: () => void;
  active: boolean;
  opacity: Animated.Value;
  isTransitioning: boolean;
}

const SaveIndicatorContext =
  createContext<SaveIndicatorContextValue | undefined>(undefined);

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

export function useSaveIndicator() {
  const ctx = useContext(SaveIndicatorContext);
  if (!ctx) {
    throw new Error('useSaveIndicator must be used within SaveIndicatorProvider');
  }
  return ctx;
}

const SaveIndicatorIcon: React.FC = () => {
  const { active, opacity } = useSaveIndicator();
  const theme = useTheme();
  const isFocused = useIsFocused();

  if (!isFocused || !active) {
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

export default SaveIndicatorIcon;
