import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { SelectableRow } from '@components/ui/molecules';
import { fonts, nearestAvailableWeight } from '@constants/fonts';
import { fontKey } from '@/constants/fonts/resolve';
import type { FontSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/useStickyRegister';

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontName,
  onSelectFont,
  fontSizeLevel,
}) => {
  const theme = useTheme();
  const delta = (fontSizeLevel - 3) * 2;
  const { registerPress } = useStickySelection();

  const Item: React.FC<{ font: typeof fonts[number] }> = ({ font }) => {
    const stickyRef = useStickyRegister(`fontFamily:${font.name}`);
    const fontSize = font.defaultSize + delta;
    const sampleWeight = nearestAvailableWeight(font.family, 400);
    const sampleKey = fontKey(font.family, sampleWeight);
    return (
      <View ref={stickyRef} collapsable={false}>
        <SelectableRow
          label={font.name}
          swatchColor={theme.colors.basic}
          selected={font.name === selectedFontName}
          onPress={() => {
            void (async () => {
              await registerPress(`fontFamily:${font.name}`);
              onSelectFont(font.name);
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
          <Item key={f.name} font={f} />
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

