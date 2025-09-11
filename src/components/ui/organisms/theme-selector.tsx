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

  const ThemeItem = ({ name, colors }: { name: string; colors: { background: string } }) => {
    const ref = useStickyRegister(`theme:${name}`);
    return (
      <View ref={ref}>
        <SelectableRow
          label={name}
          swatchColor={colors.background}
          selected={name === selectedThemeName}
          onPress={() => {
            void (async () => {
              await registerPress(`theme:${name}`, ref);
              onSelectTheme(name);
            })();
          }}
        />
      </View>
    );
  };

  return (
    <Section title="Тема">
      <View>
        {themeList.map((t) => (
          <ThemeItem key={t.name} name={t.name} colors={t.colors} />
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

