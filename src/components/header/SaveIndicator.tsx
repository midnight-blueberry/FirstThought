import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import { useSaveIndicator } from '@/features/save-indicator/context';

const SaveIndicatorIcon: React.FC = () => {
  const { active } = useSaveIndicator();
  const theme = useTheme();
  const isFocused = useIsFocused();
  const opacity = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity.current, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [active]);

  if (!isFocused) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={{ opacity: opacity.current }}>
      <Ionicons
        name="save-outline"
        size={theme.iconSize.medium}
        color={theme.colors.headerForeground}
      />
    </Animated.View>
  );
};

export default React.memo(SaveIndicatorIcon);
