import React, { useRef } from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { SelectableRow } from '@components/ui/molecules';
import { fonts, nearestAvailableWeight } from '@constants/fonts';
import { fontKey } from '@/constants/fonts/resolve';
import type { FontSelectorProps } from '@types';
import { useAnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFontName,
  onSelectFont,
  fontSizeLevel,
}) => {
  const theme = useTheme();
  const delta = (fontSizeLevel - 3) * 2;
  const anchor = useAnchorStableScrollContext();
  const itemRefs = useRef<Record<string, View | null>>({});

  return (
    <Section title="Шрифт">
      <View>
        {fonts.map((f) => {
          const fontSize = f.defaultSize + delta;
          const sampleWeight = nearestAvailableWeight(f.family, 400);
          const sampleKey = fontKey(f.family, sampleWeight);
          return (
            <View
              key={f.name}
              ref={(r) => {
                itemRefs.current[f.name] = r;
              }}
            >
              <SelectableRow
                label={f.name}
                swatchColor={theme.colors.basic}
                selected={f.name === selectedFontName}
                onPress={() => {
                  const ref = itemRefs.current[f.name];
                  if (ref && anchor) {
                    anchor.setAnchor(ref, 'center');
                    anchor.captureBeforeUpdate();
                  }
                  onSelectFont(f.name);
                }}
                labelStyle={{ fontFamily: sampleKey }}
                fontSize={fontSize}
              />
            </View>
          );
        })}
      </View>
    </Section>
  );
};

const propsAreEqual = (prev: FontSelectorProps, next: FontSelectorProps) =>
  prev.selectedFontName === next.selectedFontName &&
  prev.onSelectFont === next.onSelectFont &&
  prev.fontSizeLevel === next.fontSizeLevel;

export default React.memo(FontSelector, propsAreEqual);

