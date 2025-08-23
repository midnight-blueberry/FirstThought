import React from 'react';
import { useTheme } from 'styled-components/native';
import SelectorRow from '../atoms/selector-row';
import BarIndicator from '../atoms/bar-indicator';
import Section from './settings-section';
import type { FontSizeSelectorProps } from '@/app/settings/_types';

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  fontSizeLevel,
  onIncrease,
  onDecrease,
  blinkIndex,
  blinkAnim,
}) => {
  const theme = useTheme();

  return (
    <Section title="Размер шрифта">
      <SelectorRow onIncrease={onIncrease} onDecrease={onDecrease}>
        <BarIndicator
          total={5}
          filledCount={fontSizeLevel}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors.basic}
          fillColor={theme.colors.accent}
        />
      </SelectorRow>
    </Section>
  );
};

export default FontSizeSelector;
