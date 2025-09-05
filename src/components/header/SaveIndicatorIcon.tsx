import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

const SaveIndicatorIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <Ionicons
      name="save-outline"
      size={theme.iconSize.medium}
      color={theme.colors.headerForeground}
    />
  );
};

export default React.memo(SaveIndicatorIcon);
