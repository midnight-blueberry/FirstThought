import React, { useContext } from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  GestureResponderEvent,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import { useStickySelectionPositionContext } from '@/features/sticky-position/useStickySelectionPosition';

interface SelectableRowProps {
  label: string;
  swatchColor?: string;
  selected: boolean;
  onPress: () => void;
  fontSize?: number;
  labelStyle?: StyleProp<TextStyle>;
  onPressIn?: (e: GestureResponderEvent) => void;
  stickyKey: string;
}

const SelectableRow: React.FC<SelectableRowProps> = ({
  label,
  swatchColor,
  selected,
  onPress,
  fontSize,
  labelStyle,
  onPressIn,
  stickyKey,
}) => {
  const theme = useTheme();
  const anchorCtx = useContext(AnchorStableScrollContext);
  const sticky = useStickySelectionPositionContext();
  const itemRef = React.useRef<View>(null);
  React.useEffect(() => {
    sticky?.registerItemRef(stickyKey, itemRef);
  }, [sticky, stickyKey]);
  const drop = -theme.padding.small / 4;
  const hasSwatch = !!swatchColor;
  const paddingLeft = hasSwatch
    ? theme.margin.medium + (theme.iconSize.large - theme.iconSize.small) / 2
    : theme.margin.medium;

  return (
    <TouchableOpacity
      ref={itemRef}
      activeOpacity={1}
      onPressIn={(e) => {
        anchorCtx?.setAnchor(e.currentTarget);
        onPressIn?.(e);
      }}
      onPress={async () => {
        anchorCtx?.captureBeforeUpdate();
        onPress();
        await sticky?.onItemPress(stickyKey);
      }}
      style={[
        {
          marginBottom: theme.margin.small,
          borderColor: theme.colors.background,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          paddingRight: theme.iconSize.large + theme.padding.medium * 2,
          paddingVertical: theme.padding.medium,
          paddingLeft,
          minHeight: theme.iconSize.large + theme.padding.medium * 2,
          justifyContent: 'center',
        },
        selected && { borderColor: theme.colors.accent },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {hasSwatch && (
          <View
            style={{
              width: theme.iconSize.small,
              height: theme.iconSize.small,
              backgroundColor: swatchColor,
              borderRadius: theme.borderRadius / 2,
              marginRight: paddingLeft,
              borderColor: theme.colors.basic,
              borderWidth: theme.borderWidth.xsmall,
            }}
          />
        )}
        <AppText
          variant="medium"
          style={[
            { transform: [{ translateY: drop }] },
            fontSize
              ? { fontSize, lineHeight: fontSize + theme.padding.medium }
              : null,
            labelStyle,
          ]}
        >
          {label}
        </AppText>
      </View>
      <View
        style={{
          position: 'absolute',
          top: theme.padding.medium,
          right: theme.padding.medium,
          width: theme.iconSize.large,
          height: theme.iconSize.large,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name={"checkmark-sharp" as any}
          size={theme.iconSize.large}
          color={theme.colors.accent}
          style={{
            opacity: selected ? 1 : 0,
            transform: [{ translateY: drop }],
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SelectableRow;
