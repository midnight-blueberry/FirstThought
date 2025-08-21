import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';
import Section from './settings-section';
import SelectableRow from '../molecules/selectable-row';
import { fonts, getFontFamily } from '@/constants/Fonts';

interface FontSelectorProps {
  selectedFontName: string;
  onSelectFont: (name: string) => void;
  onSelectWeight: (weight: DefaultTheme['fontWeight']) => void;
  fontSizeLevel: number;
}

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

export default FontSelector;

