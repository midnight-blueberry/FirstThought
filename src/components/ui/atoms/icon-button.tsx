import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getDisabledControlColor, ThemeColorName } from '@theme/index';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  size?: number;
  color?: ThemeColorName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size,
  color = 'basic',
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const iconColor = disabled
    ? getDisabledControlColor(theme)
    : theme.colors[color];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : undefined}
      style={[styles.button, style]}
      hitSlop={8}
    >
      <Ionicons name={icon as any} size={size ?? theme.iconSize.large} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16
  },
});

export default IconButton;
