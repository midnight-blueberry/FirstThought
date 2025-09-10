import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
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
  increaseDisabled,
  decreaseDisabled,
  increaseLabel,
  decreaseLabel,
  opacity = 1,
  children,
}) => {
  const theme = useTheme();

  const incDisabled = increaseDisabled ?? !onIncrease;
  const decDisabled = decreaseDisabled ?? !onDecrease;

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
        onPress={decDisabled ? undefined : onDecrease}
        size={theme.iconSize.large}
        disabled={decDisabled}
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
        onPress={incDisabled ? undefined : onIncrease}
        size={theme.iconSize.large}
        disabled={incDisabled}
        accessibilityLabel={increaseLabel}
        style={{ marginLeft: theme.margin.medium }}
      />
    </View>
  );
};

export default SelectorRow;
