import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DefaultTheme, useTheme } from 'styled-components/native';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: keyof DefaultTheme['colors'];
  style?: StyleProp<ViewStyle>;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, onPress, size, color = 'basic', style }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={style} hitSlop={8}>
      <Ionicons
        name={icon}
        size={size ?? theme.iconSize.large}
        color={theme.colors[color]}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
