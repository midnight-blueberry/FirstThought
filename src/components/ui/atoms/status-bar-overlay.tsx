import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '@hooks/useTheme';

export default function StatusBarOverlay() {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  if (top === 0) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: top,
        backgroundColor: colors.headerBackground,
      }}
    />
  );
}
