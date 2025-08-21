import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';

import TextAlignIcon from '../atoms/text-align-icon';

interface TextAlignButtonProps {
  variant: 'left' | 'justify';
  onPress?: () => void;
  selected?: boolean;
}

const TextAlignButton: React.FC<TextAlignButtonProps> = ({ variant, onPress, selected }) => {
  const theme = useTheme();
  const borderColor = selected ? theme.colors.accent : 'transparent';

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity
        onPress={onPress}
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
          name="checkmark-sharp"
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
