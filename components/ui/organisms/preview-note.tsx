import React from 'react';
import { View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import Section from './settings-section';

interface PreviewNoteProps {
  noteTextAlign: DefaultTheme['noteTextAlign'];
  fontName: string;
  colors: DefaultTheme['colors'];
}

const PreviewNote: React.FC<PreviewNoteProps> = ({ noteTextAlign, fontName, colors }) => {
  const theme = useTheme();

  return (
    <Section>
      <View
        style={{
          marginTop: theme.margin.large,
          borderColor: colors.accent,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          padding: theme.padding.medium,
          alignSelf: 'stretch',
        }}
      >
        <AppText color="basic" fontFamily={fontName} style={{ textAlign: noteTextAlign }}>
          Так будет выглядеть ваша заметка в выбранном формате
        </AppText>
      </View>
    </Section>
  );
};

export default PreviewNote;
