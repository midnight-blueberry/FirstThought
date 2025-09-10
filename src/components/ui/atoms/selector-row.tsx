import React from 'react';
import { View, GestureResponderEvent } from 'react-native';
import useTheme from '@hooks/useTheme';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
  increaseDisabled?: boolean;
  decreaseDisabled?: boolean;
  opacity?: number;
  children: React.ReactNode;
  onIncreasePressIn?: (e: GestureResponderEvent) => void;
  onDecreasePressIn?: (e: GestureResponderEvent) => void;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  onIncrease,
  onDecrease,
  increaseDisabled = false,
  decreaseDisabled = false,
  opacity = 1,
  children,
  onIncreasePressIn,
  onDecreasePressIn,
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
        onPressIn={onDecreasePressIn}
        disabled={decreaseDisabled}
        size={theme.iconSize.large}
        style={{ marginRight: theme.margin.medium }}
      />
      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        {children}
      </View>
      <IconButton
        icon='add'
        onPress={onIncrease}
        onPressIn={onIncreasePressIn}
        disabled={increaseDisabled}
        size={theme.iconSize.large}
        style={{ marginLeft: theme.margin.medium }}
      />
    </View>
  );
};

export default SelectorRow;
