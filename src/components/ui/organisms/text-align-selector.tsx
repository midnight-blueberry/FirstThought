import React from 'react';
import { View } from 'react-native';
import useTheme from '@hooks/useTheme';
import Section from './settings-section';
import { TextAlignButton } from '@components/ui/molecules';
import type { TextAlignSelectorProps } from '@settings/types';

const TextAlignSelector: React.FC<TextAlignSelectorProps> = ({ noteTextAlign, onChange }) => {
  const theme = useTheme();

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
        <TextAlignButton
          variant="left"
          selected={noteTextAlign === 'left'}
          onPress={() => onChange('left')}
        />
        <TextAlignButton
          variant="justify"
          selected={noteTextAlign === 'justify'}
          onPress={() => onChange('justify')}
        />
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
