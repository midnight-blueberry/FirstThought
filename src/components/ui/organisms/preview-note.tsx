import React from 'react';
import { View } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import Section from './settings-section';
import { resolveFont } from '@/constants/fonts/resolve';
import { useSettings } from '@/state/SettingsContext';

interface PreviewNoteProps {
  noteTextAlign: DefaultTheme['noteTextAlign'];
  colors: DefaultTheme['colors'];
}

const PreviewNote: React.FC<PreviewNoteProps> = ({ noteTextAlign, colors }) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const { key } = resolveFont(
    settings.fontFamily,
    parseInt(String(settings.fontWeight), 10),
  );

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
        <AppText
          color="basic"
          style={{ textAlign: noteTextAlign, fontFamily: key }}
        >
          Так будет выглядеть ваша заметка в выбранном формате
        </AppText>
      </View>
    </Section>
  );
};

const propsAreEqual = (prev: PreviewNoteProps, next: PreviewNoteProps) =>
  prev.noteTextAlign === next.noteTextAlign && prev.colors === next.colors;

export default React.memo(PreviewNote, propsAreEqual);
