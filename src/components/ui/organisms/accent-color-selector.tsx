import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@constants/AccentColors';
import type { AccentColorSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const AccentItem: React.FC<{
  hex: string;
  name: string;
  selected: boolean;
  onSelect: (hex: string) => void;
}> = ({ hex, name, selected, onSelect }) => {
  const ref = useStickyRegister(`accent:${hex}`);
  const { registerPress } = useStickySelection();
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={hex}
        selected={selected}
        onPress={() => {
          void (async () => {
            await registerPress(`accent:${hex}`, ref);
            onSelect(hex);
          })();
        }}
      />
    </View>
  );
};

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({
  selectedAccentColor,
  onSelectAccent,
}) => {
  return (
    <Section title="Акцент">
      <View>
        {accentColors.map((color) => (
          <AccentItem
            key={color.hex}
            hex={color.hex}
            name={color.name}
            selected={color.hex === selectedAccentColor}
            onSelect={onSelectAccent}
          />
        ))}
      </View>
    </Section>
  );
};

const propsAreEqual = (
  prev: AccentColorSelectorProps,
  next: AccentColorSelectorProps,
) =>
  prev.selectedAccentColor === next.selectedAccentColor &&
  prev.onSelectAccent === next.onSelectAccent;

export default React.memo(AccentColorSelector, propsAreEqual);

