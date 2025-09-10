import React, { useContext, useRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getDisabledControlColor, ThemeColorName } from '@theme/index';
import { StableAnchorContext } from '@/features/scroll/useStableAnchor';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  size?: number;
  color?: ThemeColorName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  onPressIn,
  size,
  color = 'basic',
  style,
  disabled = false,
}) => {
  const theme = useTheme();
  const iconColor = disabled
    ? getDisabledControlColor(theme)
    : theme.colors[color];
  const anchorCtx = useContext(StableAnchorContext);
  const ref = useRef<View>(null);

  return (
    <TouchableOpacity
      ref={ref}
      onPressIn={(e) => {
        if (ref.current) {
          anchorCtx?.setAnchor(ref.current);
        }
        onPressIn?.(e);
      }}
      onPress={() => {
        anchorCtx?.captureBeforeUpdate();
        onPress?.();
      }}
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
