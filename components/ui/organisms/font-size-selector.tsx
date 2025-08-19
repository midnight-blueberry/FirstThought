import React from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import SelectorRow from '../atoms/selector-row';
import BarIndicator from '../atoms/bar-indicator';

interface FontSizeSelectorProps {
  level: number;
  onIncrease: () => void;
  onDecrease: () => void;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ level, onIncrease, onDecrease, blinkIndex, blinkAnim }) => {
  const theme = useTheme();

  return (
    <>
      <AppText variant='large' style={{ marginBottom: theme.margin.medium, marginTop: theme.margin.small }}>Размер шрифта</AppText>
      <SelectorRow onIncrease={onIncrease} onDecrease={onDecrease}>
        <BarIndicator
          total={5}
          filledCount={level}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors.basic}
          fillColor={theme.colors.accent}
        />
      </SelectorRow>
    </>
  );
};

export default FontSizeSelector;
