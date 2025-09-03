import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';

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
    <TouchableOpacity onPress={onPress} style={[ styles.button, style ]} hitSlop={8}>
      <Ionicons
        name={icon as any}
        size={size ?? theme.iconSize.large}
        color={theme.colors[color]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16
  },
});

export default IconButton;
