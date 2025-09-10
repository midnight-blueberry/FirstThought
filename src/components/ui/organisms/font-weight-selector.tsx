import React from 'react';
import useTheme from '@hooks/useTheme';
import { AppText, SelectorRow, BarIndicator } from '@components/ui/atoms';
import Section from './settings-section';
import type { FontWeightSelectorProps } from '@types';
import { listAvailableWeights } from '@/constants/fonts/resolve';
import { toFamilyKey } from '@utils/font';
import { useSettings } from '@/state/SettingsContext';

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({ onSelect, blinkAnim }) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const weights = listAvailableWeights(toFamilyKey(settings.fontFamily));
  const isSingle = weights.length === 1;
  const columnsCount = isSingle ? 5 : weights.length;
  const currentIndex = isSingle
    ? 0
    : Math.max(0, weights.indexOf(Number(settings.fontWeight)));
  const incDisabled = isSingle || currentIndex >= weights.length - 1;
  const decDisabled = isSingle || currentIndex <= 0;

  const handleIncrease = () => {
    const w = weights[currentIndex + 1];
    if (w != null) {
      onSelect(String(w) as FontWeightSelectorProps['fontWeight']);
    }
  };

  const handleDecrease = () => {
    const w = weights[currentIndex - 1];
    if (w != null) {
      onSelect(String(w) as FontWeightSelectorProps['fontWeight']);
    }
  };

  return (
    <Section title="Жирность шрифта">
      <SelectorRow
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        increaseDisabled={incDisabled}
        decreaseDisabled={decDisabled}
        opacity={isSingle ? 0.5 : 1}
      >
        <BarIndicator
          total={columnsCount}
          filledCount={isSingle ? 0 : currentIndex + 1}
          blinkIndex={isSingle ? null : currentIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors[isSingle ? 'disabled' : 'basic']}
          fillColor={theme.colors[isSingle ? 'disabled' : 'accent']}
          onPress={
            isSingle
              ? undefined
              : (i) => {
                  const w = weights[i];
                  if (w != null) {
                    onSelect(String(w) as FontWeightSelectorProps['fontWeight']);
                  }
                }
          }
        />
      </SelectorRow>
      {isSingle && (
        <AppText variant='small' color='disabled' style={{ textAlign: 'center' }}>
          Недоступно для данного шрифта
        </AppText>
      )}
    </Section>
  );
};

const propsAreEqual = (prev: FontWeightSelectorProps, next: FontWeightSelectorProps) =>
  prev.onSelect === next.onSelect &&
  prev.blinkAnim === next.blinkAnim &&
  prev.disabled === next.disabled;

export default React.memo(FontWeightSelector, propsAreEqual);

