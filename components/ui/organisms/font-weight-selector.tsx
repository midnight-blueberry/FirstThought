import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import IconButton from '../atoms/icon-button';

interface FontWeightSelectorProps {
  weights: string[];
  selectedIndex: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({ weights, selectedIndex, onIncrease, onDecrease }) => {
  const theme = useTheme();
  const hasMultiple = weights.length > 1;
  const columns = hasMultiple ? weights.length : 5;

  return (
    <>
      <AppText variant='large' style={{ marginBottom: 8, marginTop: 4 }}>Жирность шрифта</AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, opacity: hasMultiple ? 1 : 0.5 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <IconButton
            icon='remove'
            onPress={hasMultiple ? onDecrease : undefined}
            size={theme.iconSize.large}
            color={hasMultiple ? 'basic' : 'disabled'}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' }}>
          {Array.from({ length: columns }).map((_, i) => {
            const containerStyle = {
              width: theme.iconSize.small,
              height: theme.iconSize.small * (0.5 + i * 0.25),
              marginHorizontal: theme.spacing.small / 2,
              borderColor: theme.colors[hasMultiple ? 'basic' : 'disabled'],
              borderWidth: theme.borderWidth.xsmall,
              borderRadius: theme.borderRadius / 2,
              overflow: 'hidden',
            } as const;
            const innerStyle = {
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors[hasMultiple ? 'accent' : 'disabled'],
            } as const;
            const shouldFill = hasMultiple && i <= selectedIndex;
            return (
              <View key={i} style={containerStyle}>
                {shouldFill && <View style={innerStyle} />}
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <IconButton
            icon='add'
            onPress={hasMultiple ? onIncrease : undefined}
            size={theme.iconSize.large}
            color={hasMultiple ? 'basic' : 'disabled'}
          />
        </View>
      </View>
      {!hasMultiple && (
        <AppText variant='small' color='disabled' style={{ textAlign: 'center' }}>
          Недоступно для данного шрифта
        </AppText>
      )}
    </>
  );
};

export default FontWeightSelector;

