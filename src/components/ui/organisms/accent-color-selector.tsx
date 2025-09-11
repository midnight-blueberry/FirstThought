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

  const AccentItem = ({ hex, name }: { hex: string; name: string }) => {
    const ref = useStickyRegister(`accent:${hex}`);
    return (
      <View ref={ref}>
        <SelectableRow
          label={name}
          swatchColor={hex}
          selected={hex === selectedAccentColor}
          onPress={() => {
            void (async () => {
              await registerPress(`accent:${hex}`, ref);
              onSelectAccent(hex);
            })();
          }}
        />
      </View>
    );
  };

  return (
    <Section title="Акцент">
      <View>
        {accentColors.map((c) => (
          <AccentItem key={c.hex} hex={c.hex} name={c.name} />
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

