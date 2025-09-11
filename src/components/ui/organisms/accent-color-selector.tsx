import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@constants/AccentColors';
import type { AccentColorSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/useStickyRegister';

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({
  selectedAccentColor,
  onSelectAccent,
}) => {
  const Item: React.FC<{ color: typeof accentColors[number] }> = ({ color }) => {
    const stickyRef = useStickyRegister(`accent:${color.hex}`);
    const { registerPress } = useStickySelection();
    return (
      <View ref={stickyRef} collapsable={false}>
        <SelectableRow
          label={color.name}
          swatchColor={color.hex}
          selected={color.hex === selectedAccentColor}
          onPress={() => {
            void (async () => {
              await registerPress(`accent:${color.hex}`);
              onSelectAccent(color.hex);
            })();
          }}
        />
      </View>
    );
  };

  return (
    <Section title="Акцент">
      <View>
        {accentColors.map((color) => (
          <Item key={color.hex} color={color} />
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

