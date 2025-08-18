import React from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import SelectorRow from '../atoms/selector-row';
import BarIndicator from '../atoms/bar-indicator';

interface FontWeightSelectorProps {
  weights: string[];
  selectedIndex: number;
  onIncrease: () => void;
  onDecrease: () => void;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
}

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({
  weights,
  selectedIndex,
  onIncrease,
  onDecrease,
  blinkIndex,
  blinkAnim,
}) => {
  const theme = useTheme();
  const hasMultiple = weights.length > 1;
  const columns = hasMultiple ? weights.length : 5;

  return (
    <>
      <AppText variant='large' style={{ marginBottom: theme.margin.medium, marginTop: theme.margin.small }}>Жирность шрифта</AppText>
      <SelectorRow
        onIncrease={hasMultiple ? onIncrease : undefined}
        onDecrease={hasMultiple ? onDecrease : undefined}
        increaseColor={hasMultiple ? 'basic' : 'disabled'}
        decreaseColor={hasMultiple ? 'basic' : 'disabled'}
        opacity={hasMultiple ? 1 : 0.5}
      >
        <BarIndicator
          total={columns}
          filledCount={hasMultiple ? selectedIndex + 1 : 0}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors[hasMultiple ? 'basic' : 'disabled']}
          fillColor={theme.colors[hasMultiple ? 'accent' : 'disabled']}
        />
      </SelectorRow>
      {!hasMultiple && (
        <AppText variant='small' color='disabled' style={{ textAlign: 'center' }}>
          Недоступно для данного шрифта
        </AppText>
      )}
    </>
  );
};

export default FontWeightSelector;

