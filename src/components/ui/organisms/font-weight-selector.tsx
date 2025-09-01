import React from 'react';
import useTheme from '@hooks/useTheme';
import { AppText, SelectorRow, BarIndicator } from '@components/ui/atoms';
import Section from './settings-section';
import { FONT_VARIANTS, nearestAvailableWeight } from '@constants/fonts';
import { getBaseFontName } from '@utils/font';
import type { FontWeightSelectorProps } from '@types';

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({
  fontWeight,
  onIncrease,
  onDecrease,
  onSelect,
  blinkAnim,
  disabled,
}) => {
  const theme = useTheme();
  const baseName = getBaseFontName(theme.fontName);
  const family = baseName.replace(/ /g, '_');
  const weights = FONT_VARIANTS[family] ?? [400];
  const actual = nearestAvailableWeight(family, Number(fontWeight));
  const selectedIndex = Math.max(0, weights.indexOf(actual));
  const blinkIndex = selectedIndex;

  return (
    <Section title="Жирность шрифта">
      <SelectorRow
        onIncrease={disabled ? undefined : onIncrease}
        onDecrease={disabled ? undefined : onDecrease}
        increaseColor={disabled ? 'disabled' : 'basic'}
        decreaseColor={disabled ? 'disabled' : 'basic'}
        opacity={disabled ? 0.5 : 1}
      >
        <BarIndicator
          total={weights.length}
          filledCount={selectedIndex + 1}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors[disabled ? 'disabled' : 'basic']}
          fillColor={theme.colors[disabled ? 'disabled' : 'accent']}
          onPress={
            disabled
              ? undefined
              : (i) => onSelect(String(weights[i]) as FontWeightSelectorProps['fontWeight'])
          }
        />
      </SelectorRow>
      {disabled && (
        <AppText variant='small' color='disabled' style={{ textAlign: 'center' }}>
          Недоступно для данного шрифта
        </AppText>
      )}
    </Section>
  );
};

const propsAreEqual = (prev: FontWeightSelectorProps, next: FontWeightSelectorProps) =>
  prev.fontWeight === next.fontWeight &&
  prev.onIncrease === next.onIncrease &&
  prev.onDecrease === next.onDecrease &&
  prev.onSelect === next.onSelect &&
  prev.blinkAnim === next.blinkAnim &&
  prev.disabled === next.disabled;

export default React.memo(FontWeightSelector, propsAreEqual);

