import React from 'react';
import { View } from 'react-native';
import SelectableRow from '../molecules/selectable-row';
import Section from './settings-section';
import { themeList } from '@/theme';

interface ThemeSelectorProps {
  selectedThemeName: string;
  onSelectTheme: (name: string) => void;
}

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
        />
      ))}
    </View>
  </Section>
);

export default ThemeSelector;

