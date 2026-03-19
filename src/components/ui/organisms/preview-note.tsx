import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import Section from './settings-section';
import { fonts } from '@constants/fonts';
import { resolveFont } from '@/constants/fonts/resolve';
import { useSettings } from '@/state/SettingsContext';
import { toFamilyKey } from '@utils/font';
import { getFontByName } from '@utils/fontHelpers';

interface PreviewNoteProps {
  noteTextAlign: DefaultTheme['noteTextAlign'];
  colors: DefaultTheme['colors'];
  fontName?: string;
  fontWeight?: DefaultTheme['fontWeight'];
  fontSizeLevel?: number;
  sticky?: boolean;
}

const PreviewNote: React.FC<PreviewNoteProps> = ({
  noteTextAlign,
  colors,
  fontName,
  fontWeight,
  fontSizeLevel,
  sticky = false,
}) => {
  const theme = useTheme();
  const styles = React.useMemo(() => createStyles(theme, colors), [theme, colors]);
  const { settings } = useSettings();
  const resolvedFontName = fontName ?? settings.noteFontFamily ?? settings.fontFamily;
  const resolvedFontWeight =
    fontWeight ?? settings.noteFontWeight ?? settings.fontWeight;
  const resolvedFontSizeLevel =
    fontSizeLevel ?? settings.noteFontSizeLevel ?? settings.fontSizeLevel ?? 3;
  const fontMeta = getFontByName(fonts, resolvedFontName);
  const fontSize = fontMeta.defaultSize + (resolvedFontSizeLevel - 3) * 2;
  const { key } = resolveFont(
    toFamilyKey(resolvedFontName),
    parseInt(String(resolvedFontWeight), 10),
  );

  const content = (
    <View style={[styles.card, sticky ? styles.stickyCard : styles.defaultCard]}>
      <AppText
        color="basic"
        style={{
          textAlign: noteTextAlign,
          fontFamily: key,
          fontSize,
          lineHeight: fontSize + 8,
        }}
      >
        Так будет выглядеть ваша заметка в выбранном формате
      </AppText>
    </View>
  );

  if (sticky) {
    return content;
  }

  return <Section>{content}</Section>;
};

const propsAreEqual = (prev: PreviewNoteProps, next: PreviewNoteProps) =>
  prev.noteTextAlign === next.noteTextAlign &&
  prev.colors === next.colors &&
  prev.fontName === next.fontName &&
  prev.fontWeight === next.fontWeight &&
  prev.fontSizeLevel === next.fontSizeLevel &&
  prev.sticky === next.sticky;

export default React.memo(PreviewNote, propsAreEqual);

const createStyles = (theme: DefaultTheme, colors: DefaultTheme['colors']) =>
  StyleSheet.create({
    card: {
      borderColor: colors.accent,
      borderWidth: theme.borderWidth.medium,
      borderRadius: theme.borderRadius,
      padding: theme.padding.medium,
      alignSelf: 'stretch',
      backgroundColor: colors.background ?? theme.colors?.background ?? 'transparent',
    },
    defaultCard: {
      marginTop: theme.margin.large,
    },
    stickyCard: {
      marginTop: 0,
    },
  });
