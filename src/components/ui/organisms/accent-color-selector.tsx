import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { accentColors } from '@constants/AccentColors';
import type { AccentColorSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';

const AccentColorSelector: React.FC<AccentColorSelectorProps> = ({
  selectedAccentColor,
  onSelectAccent,
}) => {
  const { registerPress } = useStickySelection();
  const refs = React.useRef<Record<string, View | null>>({});

  return (
    <Section title="Акцент">
      <View>
        {accentColors.map((color) => (
          <View
            key={color.hex}
            ref={(el) => {
              refs.current[color.hex] = el;
            }}
          >
            <SelectableRow
              label={color.name}
              swatchColor={color.hex}
              selected={color.hex === selectedAccentColor}
              onPress={() => {
                const refObj = { current: refs.current[color.hex] };
                void (async () => {
                  await registerPress(`accent:${color.hex}`, refObj);
                  onSelectAccent(color.hex);
                })();
              }}
            />
          </View>
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

