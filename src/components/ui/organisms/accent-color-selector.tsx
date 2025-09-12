import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@constants/AccentColors';
import type { AccentColorSelectorProps } from '@types';
import { useStickySelection } from '@/features/sticky-position/StickySelectionContext';
import { register, unregister } from '@/features/sticky-position/registry';

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({
  selectedAccentColor,
  onSelectAccent,
}) => {
  const Item: React.FC<{ color: typeof accentColors[number] }> = ({ color }) => {
    const ref = useRef<View>(null);
    useEffect(() => {
      register(`accent:${color.hex}`, ref);
      return () => unregister(`accent:${color.hex}`);
    }, [color.hex]);
    const { registerPress } = useStickySelection();
    return (
      <View ref={ref}>
        <SelectableRow
          label={color.name}
          swatchColor={color.hex}
          selected={color.hex === selectedAccentColor}
          onPress={() => {
            void (async () => {
              await registerPress(`accent:${color.hex}`, ref);
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

