import React, { useContext, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

import { TextAlignIcon } from '@components/ui/atoms';
import { StableAnchorContext } from '@/features/scroll/useStableAnchor';

interface TextAlignButtonProps {
  variant: 'left' | 'justify';
  onPress?: () => void;
  selected?: boolean;
}

const TextAlignButton: React.FC<TextAlignButtonProps> = ({ variant, onPress, selected }) => {
  const theme = useTheme();
  const borderColor = selected ? theme.colors.accent : 'transparent';
  const anchorCtx = useContext(StableAnchorContext);
  const ref = useRef<View>(null);

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        ref={ref}
        onPressIn={() => {
          if (ref.current) {
            anchorCtx?.setAnchor(ref.current);
          }
        }}
        onPress={() => {
          anchorCtx?.captureBeforeUpdate();
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
