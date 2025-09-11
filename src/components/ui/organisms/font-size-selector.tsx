import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import { SelectorRow, BarIndicator } from '@components/ui/atoms';
import Section from './settings-section';
import type { FontSizeSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  fontSizeLevel,
  onIncrease,
  onDecrease,
  blinkIndex,
  blinkAnim,
}) => {
  const theme = useTheme();
  const incDisabled = fontSizeLevel >= 5;
  const decDisabled = fontSizeLevel <= 1;
  const { registerPress } = useStickySelection();
  const rowRef = useStickyRegister('fontSize');

  return (
    <Section title="Размер шрифта">
      <View ref={rowRef}>
        <SelectorRow
            onIncrease={() => {
              void (async () => {
                await registerPress('fontSize', rowRef);
                onIncrease();
              })();
            }}
            onDecrease={() => {
              void (async () => {
                await registerPress('fontSize', rowRef);
                onDecrease();
              })();
            }}
          increaseDisabled={incDisabled}
          decreaseDisabled={decDisabled}
        >
          <BarIndicator
            total={5}
            filledCount={fontSizeLevel}
            blinkIndex={blinkIndex}
            blinkAnim={blinkAnim}
            containerColor={theme.colors.basic}
            fillColor={theme.colors.accent}
          />
        </SelectorRow>
      </View>
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
