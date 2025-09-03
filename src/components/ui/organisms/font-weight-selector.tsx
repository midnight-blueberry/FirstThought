import React from 'react';
import useTheme from '@hooks/useTheme';
import { AppText, SelectorRow, BarIndicator } from '@components/ui/atoms';
import Section from './settings-section';
import type { FontWeightSelectorProps } from '@types';
import { listAvailableWeights } from '@/constants/fonts/resolve';
import { toFamilyKey } from '@utils/font';
import { useSettings } from '@/state/SettingsContext';

const FontWeightSelector: React.FC<FontWeightSelectorProps> = ({
  fontWeight,
  onIncrease,
  onDecrease,
  onSelect,
  blinkAnim,
  disabled: disabledProp,
}) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const weights = listAvailableWeights(toFamilyKey(settings.fontFamily));
  const hasOnlyOneWeight = weights.length === 1;
  const disabled = disabledProp || hasOnlyOneWeight;
  const selectedIndex = Math.max(0, weights.indexOf(Number(fontWeight)));
  const blinkIndex = hasOnlyOneWeight ? null : selectedIndex;
  const STEPS = [0, 1, 2, 3, 4] as const;

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
          total={STEPS.length}
          filledCount={hasOnlyOneWeight ? 0 : selectedIndex + 1}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
          containerColor={theme.colors[disabled ? 'disabled' : 'basic']}
          fillColor={theme.colors[disabled ? 'disabled' : 'accent']}
          onPress={
            hasOnlyOneWeight
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

