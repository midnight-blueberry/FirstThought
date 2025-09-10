import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

interface SaveIndicatorContextValue {
  show: () => void;
  hide: () => void;
  opacity: Animated.Value;
  visible: boolean;
}

const SaveIndicatorContext = createContext<SaveIndicatorContextValue | undefined>(
  undefined,
);

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const show = useCallback(() => {
    setVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 350,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }, [opacity]);

  const value = useMemo(
    () => ({ show, hide, opacity, visible }),
    [show, hide, opacity, visible],
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

const SaveIndicator: React.FC = () => {
  const routeName = useNavigationState(
    (state) => state.routes[state.index]?.name,
  );
  const { visible, opacity } = useSaveIndicator();
  const theme = useTheme();

  if (routeName !== 'Settings' || !visible) {
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
