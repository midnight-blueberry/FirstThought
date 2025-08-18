import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
  increaseColor?: keyof DefaultTheme['colors'];
  decreaseColor?: keyof DefaultTheme['colors'];
  opacity?: number;
  children: React.ReactNode;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  onIncrease,
  onDecrease,
  increaseColor = 'basic',
  decreaseColor = 'basic',
  opacity = 1,
  children,
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
        size={theme.iconSize.large}
        color={decreaseColor}
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
        size={theme.iconSize.large}
        color={increaseColor}
        style={{ marginLeft: theme.margin.medium }}
      />
    </View>
  );
};

export default SelectorRow;
