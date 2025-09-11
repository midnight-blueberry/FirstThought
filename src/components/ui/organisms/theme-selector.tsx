import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { themeList } from '@theme/buildTheme';
import type { ThemeSelectorProps } from '@types';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedThemeName, onSelectTheme }) => (
  <Section title="Тема">
    <View>
      {themeList.map(themeItem => (
        <SelectableRow
          key={themeItem.name}
          label={themeItem.name}
          swatchColor={themeItem.colors.background}
          selected={themeItem.name === selectedThemeName}
          onPress={() => onSelectTheme(themeItem.name)}
          itemId={`theme:${themeItem.name}`}
        />
      ))}
    </View>
  </Section>
);

const propsAreEqual = (
  prev: ThemeSelectorProps,
  next: ThemeSelectorProps,
) =>
  prev.selectedThemeName === next.selectedThemeName &&
  prev.onSelectTheme === next.onSelectTheme;

export default React.memo(ThemeSelector, propsAreEqual);

