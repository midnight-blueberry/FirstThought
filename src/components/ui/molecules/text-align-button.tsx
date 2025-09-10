import React, { useContext } from 'react';
import { TouchableOpacity, View, GestureResponderEvent } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

import { TextAlignIcon } from '@components/ui/atoms';
import { AnchorContext } from '@/features/scroll/useAnchorStableScroll';

interface TextAlignButtonProps {
  variant: 'left' | 'justify';
  onPress?: () => void;
  selected?: boolean;
}

const TextAlignButton: React.FC<TextAlignButtonProps> = ({ variant, onPress, selected }) => {
  const theme = useTheme();
  const borderColor = selected ? theme.colors.accent : 'transparent';
  const setAnchor = useContext(AnchorContext);
  const handlePressIn = (e: GestureResponderEvent) => setAnchor(e.currentTarget as any);

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
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
