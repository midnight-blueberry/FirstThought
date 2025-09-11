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
  const Item: React.FC<{ item: typeof themeList[number] }> = ({ item }) => {
    const ref = useStickyRegister(`theme:${item.name}`);
    const { registerPress } = useStickySelection();
    return (
      <View ref={ref}>
        <SelectableRow
          label={item.name}
          swatchColor={item.colors.background}
          selected={item.name === selectedThemeName}
          onPress={() => {
            void (async () => {
              await registerPress(`theme:${item.name}`, ref);
              onSelectTheme(item.name);
            })();
          }}
        />
      </View>
    );
  };

  return (
    <Section title="Тема">
      <View>
        {themeList.map((themeItem) => (
          <Item key={themeItem.name} item={themeItem} />
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

