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

  const pressableProps = disabled
    ? { pointerEvents: 'none' as const }
    : {
        onPress,
        onLongPress,
        android_ripple: { color: theme.colors[color] },
      };

  return (
    <Pressable
      {...pressableProps}
      accessibilityState={disabled ? { disabled: true } : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        style,
        !disabled && pressed ? styles.pressed : null,
      ]}
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
  pressed: { opacity: 0.6 },
});

export default IconButton;
