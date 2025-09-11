import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { themeList } from '@theme/buildTheme';
import type { ThemeSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/registry';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeName,
  onSelectTheme,
}) => {
  const { registerPress } = useStickySelection();

  return (
    <Section title="Тема">
      <View>
        {themeList.map((themeItem) => (
          <ThemeItem
            key={themeItem.name}
            name={themeItem.name}
            color={themeItem.colors.background}
            selected={themeItem.name === selectedThemeName}
            onSelect={onSelectTheme}
            registerPress={registerPress}
          />
        ))}
      </View>
    </Section>
  );
};

interface ThemeItemProps {
  name: string;
  color: string;
  selected: boolean;
  onSelect: (name: string) => void;
  registerPress: (
    id: string,
    ref: React.RefObject<View | null>,
  ) => Promise<void>;
}

const ThemeItem: React.FC<ThemeItemProps> = ({
  name,
  color,
  selected,
  onSelect,
  registerPress,
}) => {
  const ref = useStickyRegister(`theme:${name}`);
  return (
    <View ref={ref}>
      <SelectableRow
        label={name}
        swatchColor={color}
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

const propsAreEqual = (
  prev: ThemeSelectorProps,
  next: ThemeSelectorProps,
) =>
  prev.selectedThemeName === next.selectedThemeName &&
  prev.onSelectTheme === next.onSelectTheme;

export default React.memo(ThemeSelector, propsAreEqual);

