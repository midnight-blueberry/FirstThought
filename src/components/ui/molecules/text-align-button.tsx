import React, { useContext } from 'react';
import { TouchableOpacity, View, GestureResponderEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

import { TextAlignIcon } from '@components/ui/atoms';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import useStickySelection from '@/features/sticky-position/useStickySelection';

interface TextAlignButtonProps {
  variant: 'left' | 'justify';
  onPress?: () => void;
  selected?: boolean;
  itemId: string;
}

const TextAlignButton: React.FC<TextAlignButtonProps> = ({
  variant,
  onPress,
  selected,
  itemId,
}) => {
  const theme = useTheme();
  const borderColor = selected ? theme.colors.accent : 'transparent';
  const anchorCtx = useContext(AnchorStableScrollContext);
  const { registerPress } = useStickySelection();
  const ref = React.useRef<View>(null);

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        ref={ref}
        onPressIn={(e: GestureResponderEvent) => {
          anchorCtx?.setAnchor(e.currentTarget);
        }}
        onPress={async () => {
          anchorCtx?.captureBeforeUpdate();
          await registerPress(itemId, ref);
          onPress?.();
        }}
        hitSlop={8}
        style={{
          borderColor,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          padding: theme.padding.large,
        }}
      >
        <TextAlignIcon variant={variant} color={theme.colors.basic} />
      </TouchableOpacity>

      {selected && (
        <Ionicons
          name={"checkmark-sharp" as any}
          size={theme.iconSize.large}
          color={theme.colors.accent}
          style={{
            position: 'absolute',
            right: -(theme.iconSize.large + theme.margin.small),
            top: '50%',
            marginTop: -(theme.iconSize.large / 2),
          }}
        />
      )}
    </View>
  );
};

export default TextAlignButton;
