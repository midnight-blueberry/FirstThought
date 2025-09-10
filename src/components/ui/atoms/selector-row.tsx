import React from 'react';
import { View } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
  increaseColor?: keyof DefaultTheme['colors'];
  decreaseColor?: keyof DefaultTheme['colors'];
  increaseDisabled?: boolean;
  decreaseDisabled?: boolean;
  increaseLabel?: string;
  decreaseLabel?: string;
  opacity?: number;
  children: React.ReactNode;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  onIncrease,
  onDecrease,
  increaseColor = 'basic',
  decreaseColor = 'basic',
  increaseDisabled = false,
  decreaseDisabled = false,
  increaseLabel,
  decreaseLabel,
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
        onPress={decreaseDisabled ? undefined : onDecrease}
        size={theme.iconSize.large}
        color={decreaseColor}
        disabled={decreaseDisabled}
        accessibilityLabel={decreaseLabel}
        style={{ marginRight: theme.margin.medium }}
      />
      <View
        style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        {children}
      </View>
      <IconButton
        icon='add'
        onPress={increaseDisabled ? undefined : onIncrease}
        size={theme.iconSize.large}
        color={increaseColor}
        disabled={increaseDisabled}
        accessibilityLabel={increaseLabel}
        style={{ marginLeft: theme.margin.medium }}
      />
    </View>
  );
};

export default SelectorRow;
