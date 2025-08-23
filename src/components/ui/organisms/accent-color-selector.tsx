import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@config/AccentColors';
import type { AccentColorSelectorProps } from '@types';

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({ selectedAccentColor, onSelectAccent }) => (
  <Section title="Акцент">
    <View>
      {accentColors.map(color => (
        <SelectableRow
          key={color.hex}
          label={color.name}
          swatchColor={color.hex}
          selected={color.hex === selectedAccentColor}
          onPress={() => onSelectAccent(color.hex)}
        />
      ))}
    </View>
  </Section>
);

const propsAreEqual = (
  prev: AccentColorSelectorProps,
  next: AccentColorSelectorProps,
) =>
  prev.selectedAccentColor === next.selectedAccentColor &&
  prev.onSelectAccent === next.onSelectAccent;

export default React.memo(AccentColorSelector, propsAreEqual);

