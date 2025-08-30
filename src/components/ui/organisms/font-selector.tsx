import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import type { DefaultTheme } from 'styled-components/native';
import Section from './settings-section';
import { SelectableRow } from '@components/ui/molecules';
import { fonts } from '@constants/fonts';
import type { FontSelectorProps } from '@types';

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
              fontFamily={f.family}
              fontWeight={f.defaultWeight}
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

