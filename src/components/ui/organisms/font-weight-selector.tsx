import React from 'react';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import SelectorRow from '../atoms/selector-row';
import BarIndicator from '../atoms/bar-indicator';
import Section from './settings-section';
import { fonts } from '@constants/Fonts';
import { getBaseFontName } from '@utils/font';
import { getFontByName, getWeightIndex } from '@utils/fontHelpers';
import type { FontWeightSelectorProps } from '@settings/types';

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({
  fontWeight,
  onIncrease,
  onDecrease,
  blinkAnim,
  disabled,
}) => {
  const theme = useTheme();
  const baseName = getBaseFontName(theme.fontName);
  const font = getFontByName(fonts, baseName);
  const columns = disabled ? 5 : font.weights.length;
  const filledCount = disabled ? 0 : getWeightIndex(font, fontWeight as string) + 1;
  const blinkIndex = filledCount > 0 ? filledCount - 1 : null;

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
          total={columns}
          filledCount={filledCount}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors[disabled ? 'disabled' : 'basic']}
          fillColor={theme.colors[disabled ? 'disabled' : 'accent']}
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
  prev.blinkAnim === next.blinkAnim &&
  prev.disabled === next.disabled;

export default React.memo(FontWeightSelector, propsAreEqual);

