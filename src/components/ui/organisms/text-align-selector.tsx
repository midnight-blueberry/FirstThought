import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { TextAlignButton } from '@components/ui/molecules';
import type { TextAlignSelectorProps } from '@types';
import { useStickySelection } from '@/features/sticky-position';
import { register, unregister } from '@/features/sticky-position/registry';

const TextAlignSelector: React.FC<TextAlignSelectorProps> = ({ noteTextAlign, onChange }) => {
  const theme = useTheme();
  const { registerPress } = useStickySelection();
  const leftRef = useRef<View>(null);
  const justifyRef = useRef<View>(null);
  useEffect(() => {
    register('align:left', leftRef);
    register('align:justify', justifyRef);
    return () => {
      unregister('align:left');
      unregister('align:justify');
    };
  }, []);

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
        <View ref={leftRef}>
          <TextAlignButton
            variant="left"
            selected={noteTextAlign === 'left'}
            onPress={() => {
              void (async () => {
                await registerPress('align:left', leftRef);
                onChange('left');
              })();
            }}
          />
        </View>
        <View ref={justifyRef}>
          <TextAlignButton
            variant="justify"
            selected={noteTextAlign === 'justify'}
            onPress={() => {
              void (async () => {
                await registerPress('align:justify', justifyRef);
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
