import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { SelectableRow } from '@components/ui/molecules';
import { fonts, nearestAvailableWeight } from '@constants/fonts';
import { fontKey } from '@/constants/fonts/resolve';
import type { FontSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const FontItem: React.FC<{
  name: string;
  selected: boolean;
  onSelect: (name: string) => void;
  fontSize: number;
  sampleKey: string;
  swatch: string;
}> = ({ name, selected, onSelect, fontSize, sampleKey, swatch }) => {
  const ref = useStickyRegister(`fontFamily:${name}`);
  const { registerPress } = useStickySelection();
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={swatch}
        selected={selected}
        onPress={() => {
          void (async () => {
            await registerPress(`fontFamily:${name}`, ref);
            onSelect(name);
          })();
        }}
        labelStyle={{ fontFamily: sampleKey }}
        fontSize={fontSize}
      />
    </View>
  );
};

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontName,
  onSelectFont,
  fontSizeLevel,
}) => {
  const theme = useTheme();
  const delta = (fontSizeLevel - 3) * 2;

  return (
    <Section title="Шрифт">
      <View>
        {fonts.map((f) => {
          const fontSize = f.defaultSize + delta;
          const sampleWeight = nearestAvailableWeight(f.family, 400);
          const sampleKey = fontKey(f.family, sampleWeight);
          return (
            <FontItem
              key={f.name}
              name={f.name}
              selected={f.name === selectedFontName}
              onSelect={onSelectFont}
              fontSize={fontSize}
              sampleKey={sampleKey}
              swatch={theme.colors.basic}
            />
          );
        })}
      </View>
    </Section>
  );
};

const propsAreEqual = (prev: FontSelectorProps, next: FontSelectorProps) =>
  prev.selectedFontName === next.selectedFontName &&
  prev.onSelectFont === next.onSelectFont &&
  prev.fontSizeLevel === next.fontSizeLevel;

export default React.memo(FontSelector, propsAreEqual);

