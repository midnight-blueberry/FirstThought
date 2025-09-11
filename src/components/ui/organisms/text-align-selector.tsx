import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { TextAlignButton } from '@components/ui/molecules';
import type { TextAlignSelectorProps } from '@types';
import useStickySelection from '@/features/sticky-position/useStickySelection';
import { useStickyRegister } from '@/features/sticky-position/useStickyRegister';

const TextAlignSelector: React.FC<TextAlignSelectorProps> = ({ noteTextAlign, onChange }) => {
  const theme = useTheme();
  const { registerPress } = useStickySelection();
  const leftRef = useStickyRegister('align:left');
  const justifyRef = useStickyRegister('align:justify');

  return (
    <Section title="Выравнивание текста в заметках">
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          alignSelf: 'stretch',
          paddingTop: theme.padding.large,
        }}
      >
        <View ref={leftRef} collapsable={false}>
          <TextAlignButton
            variant="left"
            selected={noteTextAlign === 'left'}
            onPress={() => {
              void (async () => {
                await registerPress('align:left');
                onChange('left');
              })();
            }}
          />
        </View>
        <View ref={justifyRef} collapsable={false}>
          <TextAlignButton
            variant="justify"
            selected={noteTextAlign === 'justify'}
            onPress={() => {
              void (async () => {
                await registerPress('align:justify');
                onChange('justify');
              })();
            }}
          />
        </View>
      </View>
    </Section>
  );
};

const propsAreEqual = (
  prev: TextAlignSelectorProps,
  next: TextAlignSelectorProps,
) =>
  prev.noteTextAlign === next.noteTextAlign &&
  prev.onChange === next.onChange;

export default React.memo(TextAlignSelector, propsAreEqual);
