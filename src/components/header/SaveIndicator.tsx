import React from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import { useSaveIndicator } from '@features/save-indicator';

const SaveIndicatorIcon: React.FC = () => {
  const { active, opacity } = useSaveIndicator();
  const theme = useTheme();
  const isFocused = useIsFocused();

  if (!isFocused || !active) {
    return null;
  }

  return (
    <Animated.View pointerEvents="none" style={{ opacity }}>
      <Ionicons
        name="save-outline"
        size={theme.iconSize.medium}
        color={theme.colors.headerForeground}
      />
    </Animated.View>
  );
};

export default SaveIndicatorIcon;
