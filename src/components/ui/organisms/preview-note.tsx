import React from 'react';
import { View } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import Section from '@components/ui/organisms/settings-section';

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

const propsAreEqual = (prev: PreviewNoteProps, next: PreviewNoteProps) =>
  prev.noteTextAlign === next.noteTextAlign &&
  prev.fontName === next.fontName &&
  prev.colors === next.colors;

export default React.memo(PreviewNote, propsAreEqual);
