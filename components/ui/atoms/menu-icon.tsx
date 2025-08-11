import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';

const MenuIcon: React.FC = () => {
  const theme = useTheme();
  return (
    <Ionicons
      name="menu"
      size={theme.iconSize.large}
      color={theme.colors.primary}
    />
  );
};

export default MenuIcon;
