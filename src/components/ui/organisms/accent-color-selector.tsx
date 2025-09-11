import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@constants/AccentColors';
import type { AccentColorSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({
  selectedAccentColor,
  onSelectAccent,
}) => {
  const { registerPress } = useStickySelection();

  return (
    <Section title="Акцент">
      <View>
        {accentColors.map((color) => (
          <AccentItem
            key={color.hex}
            color={color.hex}
            name={color.name}
            selected={color.hex === selectedAccentColor}
            onSelect={onSelectAccent}
            registerPress={registerPress}
          />
        ))}
      </View>
    </Section>
  );
};

interface AccentItemProps {
  color: string;
  name: string;
  selected: boolean;
  onSelect: (c: string) => void;
  registerPress: (
    id: string,
    ref: React.RefObject<View | null>,
  ) => Promise<void>;
}

const AccentItem: React.FC<AccentItemProps> = ({
  color,
  name,
  selected,
  onSelect,
  registerPress,
}) => {
  const ref = useStickyRegister(`accent:${color}`);
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={color}
        selected={selected}
        onPress={() => {
          void (async () => {
            await registerPress(`accent:${color}`, ref);
            onSelect(color);
          })();
        }}
      />
    </View>
  );
};


const propsAreEqual = (
  prev: AccentColorSelectorProps,
  next: AccentColorSelectorProps,
) =>
  prev.selectedAccentColor === next.selectedAccentColor &&
  prev.onSelectAccent === next.onSelectAccent;

export default React.memo(AccentColorSelector, propsAreEqual);

