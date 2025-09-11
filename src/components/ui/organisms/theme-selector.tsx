import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { themeList } from '@theme/buildTheme';
import type { ThemeSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const ThemeItem: React.FC<{
  name: string;
  background: string;
  selected: boolean;
  onSelect: (name: string) => void;
}> = ({ name, background, selected, onSelect }) => {
  const ref = useStickyRegister(`theme:${name}`);
  const { registerPress } = useStickySelection();
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={background}
        selected={selected}
        onPress={() => {
          void (async () => {
            await registerPress(`theme:${name}`, ref);
            onSelect(name);
          })();
        }}
      />
    </View>
  );
};

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeName,
  onSelectTheme,
}) => {
  return (
    <Section title="Тема">
      <View>
        {themeList.map((themeItem) => (
          <ThemeItem
            key={themeItem.name}
            name={themeItem.name}
            background={themeItem.colors.background}
            selected={themeItem.name === selectedThemeName}
            onSelect={onSelectTheme}
          />
        ))}
      </View>
    </Section>
  );
};

const propsAreEqual = (
  prev: ThemeSelectorProps,
  next: ThemeSelectorProps,
) =>
  prev.selectedThemeName === next.selectedThemeName &&
  prev.onSelectTheme === next.onSelectTheme;

export default React.memo(ThemeSelector, propsAreEqual);

