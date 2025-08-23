import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import type { DefaultTheme } from 'styled-components/native';
import Section from './settings-section';
import SelectableRow from '../molecules/selectable-row';
import { fonts, getFontFamily } from '@/constants/Fonts';
import type { FontSelectorProps } from '@/src/settings/types';

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontName,
  onSelectFont,
  onSelectWeight,
  fontSizeLevel,
}) => {
  const theme = useTheme();
  const delta = (fontSizeLevel - 3) * 2;

  return (
    <Section title="Шрифт">
      <View>
        {fonts.map(f => {
          const fontSize = f.defaultSize + delta;
          return (
            <SelectableRow
              key={f.name}
              label={f.name}
              swatchColor={theme.colors.basic}
              selected={f.name === selectedFontName}
              onPress={() => {
                onSelectFont(f.name);
                onSelectWeight(f.defaultWeight as DefaultTheme['fontWeight']);
              }}
              fontFamily={getFontFamily(f.family, f.defaultWeight)}
              fontWeight="normal"
              fontSize={fontSize}
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
  prev.onSelectWeight === next.onSelectWeight &&
  prev.fontSizeLevel === next.fontSizeLevel;

export default React.memo(FontSelector, propsAreEqual);

