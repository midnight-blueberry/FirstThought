import React from 'react';
import { View } from 'react-native';
import SelectableRow from '../molecules/selectable-row';
import Section from './settings-section';
import { accentColors } from '@/constants/AccentColors';
import type { AccentColorSelectorProps } from '@/src/settings/types';

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

export default AccentColorSelector;

