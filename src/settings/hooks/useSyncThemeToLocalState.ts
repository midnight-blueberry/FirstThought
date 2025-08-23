import { useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import type { DefaultTheme } from 'styled-components/native';
import { fonts } from '@/constants/Fonts';
import { getBaseFontName, calcFontSizeLevel } from '@/app/settings/_utils/font';

type Setters = {
  setSelectedThemeName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedAccentColor: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFontName?: React.Dispatch<React.SetStateAction<string>>;
  setFontWeight?: React.Dispatch<React.SetStateAction<DefaultTheme['fontWeight']>>;
  setFontSizeLevel?: React.Dispatch<React.SetStateAction<number>>;
  setNoteTextAlign: React.Dispatch<React.SetStateAction<DefaultTheme['noteTextAlign']>>;
};

export default function useSyncThemeToLocalState(
  theme: DefaultTheme,
  {
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeight,
    setFontSizeLevel,
    setNoteTextAlign,
  }: Setters,
) {
  const sync = useCallback(() => {
    setSelectedThemeName(theme.name);
    setSelectedAccentColor(theme.colors.accent);
    const baseName = getBaseFontName(theme.fontName);
    setSelectedFontName?.(baseName);
    setFontWeight?.(theme.fontWeight);
    const fontInfo = fonts.find(f => f.name === baseName) ?? fonts[0];
    const level = calcFontSizeLevel(theme.fontSize.small, fontInfo.defaultSize);
    setFontSizeLevel?.(level);
    setNoteTextAlign(theme.noteTextAlign);
  }, [
    theme.name,
    theme.colors.accent,
    theme.fontName,
    theme.fontWeight,
    theme.fontSize.small,
    theme.noteTextAlign,
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeight,
    setFontSizeLevel,
    setNoteTextAlign,
  ]);

  useEffect(() => {
    sync();
  }, [sync]);

  useFocusEffect(
    useCallback(() => {
      sync();
    }, [sync]),
  );
}

