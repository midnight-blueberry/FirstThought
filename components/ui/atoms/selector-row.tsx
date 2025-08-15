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
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, opacity }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <IconButton icon='remove' onPress={onDecrease} size={theme.iconSize.large} color={decreaseColor} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
        {children}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <IconButton icon='add' onPress={onIncrease} size={theme.iconSize.large} color={increaseColor} />
      </View>
    </View>
  );
};

export default SelectorRow;
