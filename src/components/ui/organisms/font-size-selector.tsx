import React from 'react';
import useTheme from '@hooks/useTheme';
import { SelectorRow, BarIndicator } from '@components/ui/atoms';
import Section from './settings-section';
import type { FontSizeSelectorProps } from '@types';

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

const propsAreEqual = (prev: FontSizeSelectorProps, next: FontSizeSelectorProps) =>
  prev.fontSizeLevel === next.fontSizeLevel &&
  prev.onIncrease === next.onIncrease &&
  prev.onDecrease === next.onDecrease &&
  prev.blinkIndex === next.blinkIndex &&
  prev.blinkAnim === next.blinkAnim;

export default React.memo(FontSizeSelector, propsAreEqual);
