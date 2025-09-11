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
              fontSize={fontSize}
              sampleKey={sampleKey}
              selected={f.name === selectedFontName}
              onSelect={onSelectFont}
              registerPress={registerPress}
              themeColor={theme.colors.basic}
            />
          );
        })}
      </View>
    </Section>
  );
};

interface FontItemProps {
  name: string;
  fontSize: number;
  sampleKey: string;
  selected: boolean;
  onSelect: (name: string) => void;
  registerPress: (
    id: string,
    ref: React.RefObject<View | null>,
  ) => Promise<void>;
  themeColor: string;
}

const FontItem: React.FC<FontItemProps> = ({
  name,
  fontSize,
  sampleKey,
  selected,
  onSelect,
  registerPress,
  themeColor,
}) => {
  const ref = useStickyRegister(`fontFamily:${name}`);
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={themeColor}
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

const propsAreEqual = (prev: FontSelectorProps, next: FontSelectorProps) =>
  prev.selectedFontName === next.selectedFontName &&
  prev.onSelectFont === next.onSelectFont &&
  prev.fontSizeLevel === next.fontSizeLevel;

export default React.memo(FontSelector, propsAreEqual);

