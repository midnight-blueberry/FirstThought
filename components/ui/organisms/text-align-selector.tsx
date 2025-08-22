import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import Section from './settings-section';
import TextAlignButton from '../molecules/text-align-button';
import type { TextAlignSelectorProps } from '@/settings/types';

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

export default TextAlignSelector;
