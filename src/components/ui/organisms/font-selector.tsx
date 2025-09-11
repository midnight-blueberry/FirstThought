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

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontName,
  onSelectFont,
  fontSizeLevel,
}) => {
  const theme = useTheme();
  const delta = (fontSizeLevel - 3) * 2;
  const { registerPress } = useStickySelection();

  const FontItem = ({
    name,
    family,
    defaultSize,
  }: {
    name: string;
    family: string;
    defaultSize: number;
  }) => {
    const fontSize = defaultSize + delta;
    const sampleWeight = nearestAvailableWeight(family, 400);
    const sampleKey = fontKey(family, sampleWeight);
    const ref = useStickyRegister(`fontFamily:${name}`);
    return (
      <View ref={ref}>
        <SelectableRow
          label={name}
          swatchColor={theme.colors.basic}
          selected={name === selectedFontName}
          onPress={() => {
            void (async () => {
              await registerPress(`fontFamily:${name}`, ref);
              onSelectFont(name);
            })();
          }}
          labelStyle={{ fontFamily: sampleKey }}
          fontSize={fontSize}
        />
      </View>
    );
  };

  return (
    <Section title="Шрифт">
      <View>
        {fonts.map((f) => (
          <FontItem key={f.name} name={f.name} family={f.family} defaultSize={f.defaultSize} />
        ))}
      </View>
    </Section>
  );
};

const propsAreEqual = (prev: FontSelectorProps, next: FontSelectorProps) =>
  prev.selectedFontName === next.selectedFontName &&
  prev.onSelectFont === next.onSelectFont &&
  prev.fontSizeLevel === next.fontSizeLevel;

export default React.memo(FontSelector, propsAreEqual);

