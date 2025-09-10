import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getDisabledColor } from '@utils/theme';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  onLongPress?: () => void;
  size?: number;
  color?: keyof DefaultTheme['colors'];
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  onLongPress,
  size,
  color = 'basic',
  style,
  disabled = false,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const iconColor = disabled ? getDisabledColor(theme) : theme.colors[color];
  const fillColor = disabled ? getDisabledColor(theme, 'fill') : undefined;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      android_ripple={disabled ? undefined : { color: theme.colors[color] + '32', borderless: true }}
      style={({ pressed }) => [
        styles.button,
        style,
        disabled ? { backgroundColor: fillColor, borderColor: getDisabledColor(theme) } : null,
        !disabled && pressed ? { opacity: 0.5 } : null,
      ]}
      disabled={disabled}
      pointerEvents={disabled ? 'none' : 'auto'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={disabled ? { disabled: true } : undefined}
      hitSlop={8}
    >
      <Ionicons
        name={icon as any}
        size={size ?? theme.iconSize.large}
        color={iconColor}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
  },
});

export default IconButton;
