import React from 'react';
import { View } from 'react-native';
import { SelectableRow } from '@components/ui/molecules';
import Section from './settings-section';
import { themeList } from '@theme/buildTheme';
import type { ThemeSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedThemeName,
  onSelectTheme,
}) => {
  const { registerPress } = useStickySelection();
  const refs = React.useRef<Record<string, View | null>>({});

  return (
    <Section title="Тема">
      <View>
        {themeList.map((themeItem) => (
          <View
            key={themeItem.name}
            ref={(el) => {
              refs.current[themeItem.name] = el;
            }}
          >
            <SelectableRow
              label={themeItem.name}
              swatchColor={themeItem.colors.background}
              selected={themeItem.name === selectedThemeName}
              onPress={() => {
                const refObj = { current: refs.current[themeItem.name] };
                void (async () => {
                  await registerPress(`theme:${themeItem.name}`, refObj);
                  onSelectTheme(themeItem.name);
                })();
              }}
            />
          </View>
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

