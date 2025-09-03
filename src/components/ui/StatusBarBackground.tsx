import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '@hooks/useTheme';

const StatusBarBackground = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return <View style={{ height: insets.top, backgroundColor: theme.colors.headerBackground }} />;
};

export default StatusBarBackground;
