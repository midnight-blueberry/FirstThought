import React, { useContext } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  GestureResponderEvent,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getDisabledControlColor, ThemeColorName } from '@theme/index';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import useStickySelection from '@/features/sticky-position/useStickySelection';

interface IconButtonProps {
  icon: string;
  onPress?: () => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  size?: number;
  color?: ThemeColorName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  itemId?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  onPressIn,
  size,
  color = 'basic',
  style,
  disabled = false,
  itemId,
}) => {
  const theme = useTheme();
  const iconColor = disabled
    ? getDisabledControlColor(theme)
    : theme.colors[color];
  const anchorCtx = useContext(AnchorStableScrollContext);
  const { registerPress } = useStickySelection();
  const ref = React.useRef<View>(null);

  return (
    <TouchableOpacity
      ref={ref}
      onPressIn={(e) => {
        anchorCtx?.setAnchor(e.currentTarget);
        onPressIn?.(e);
      }}
      onPress={async () => {
        anchorCtx?.captureBeforeUpdate();
        if (itemId) {
          await registerPress(itemId, ref);
        }
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
