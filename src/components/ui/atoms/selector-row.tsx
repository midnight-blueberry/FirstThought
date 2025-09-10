import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import IconButton from './icon-button';

interface SelectorRowProps {
  onIncrease?: () => void;
  onDecrease?: () => void;
  opacity?: number;
  children: React.ReactNode;
}

const SelectorRow: React.FC<SelectorRowProps> = ({
  onIncrease,
  onDecrease,
  opacity = 1,
  children,
}) => {
  const theme = useTheme();
  const incDisabled = !onIncrease;
  const decDisabled = !onDecrease;

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
        disabled={decDisabled}
        accessibilityLabel='Уменьшить'
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
        disabled={incDisabled}
        accessibilityLabel='Увеличить'
        style={{ marginLeft: theme.margin.medium }}
      />
    </View>
  );
};

export default SelectorRow;
