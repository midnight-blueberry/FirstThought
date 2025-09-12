import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '@hooks/useTheme';

const StatusBarUnderlay = () => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  if (top === 0) {
    return null;
  }

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: top,
        backgroundColor: theme.colors.headerBackground,
        zIndex: 1,
      }}
    />
  );
};

export default StatusBarUnderlay;

