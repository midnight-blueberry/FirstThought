import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
  increaseDisabled?: boolean;
  decreaseDisabled?: boolean;
  opacity?: number;
  children: React.ReactNode;
  incItemId?: string;
  decItemId?: string;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  onIncrease,
  onDecrease,
  increaseDisabled = false,
  decreaseDisabled = false,
  opacity = 1,
  children,
  incItemId,
  decItemId,
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.margin.small,
        opacity,
      }}
    >
      <IconButton
        icon='remove'
        onPress={onDecrease}
        disabled={decreaseDisabled}
        size={theme.iconSize.large}
        style={{ marginRight: theme.margin.medium }}
        itemId={decItemId}
      />
      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        {children}
      </View>
      <IconButton
        icon='add'
        onPress={onIncrease}
        disabled={increaseDisabled}
        size={theme.iconSize.large}
        style={{ marginLeft: theme.margin.medium }}
        itemId={incItemId}
      />
    </View>
  );
};

export default SelectorRow;
