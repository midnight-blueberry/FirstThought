import type { SectionPropsMap } from '@types';
import type { DefaultTheme } from 'styled-components/native';
import { getFontByName, hasMultipleWeights } from '@utils/fontHelpers';
import { fonts } from '@constants/fonts';

export interface BuildArgs {
  selectedThemeName: string;
  selectedAccentColor: string;
  selectedFontName: string;
  fontSizeLevel: number;
  fontWeight: DefaultTheme['fontWeight'];
  noteTextAlign: DefaultTheme['noteTextAlign'];
  // blink
  sizeBlinkIndex: number | null;
  sizeBlinkAnim: any;
  weightBlinkAnim: any;
  // handlers
  onSelectTheme: (n: string) => void;
  onSelectAccent: (c: string) => void;
  onSelectFont: (n: string) => void;
  onSelectWeight: () => void; // noop
  onIncFontSize: () => void;
  onDecFontSize: () => void;
  onIncWeight: () => void;
  onDecWeight: () => void;
  onAlign: (a: DefaultTheme['noteTextAlign']) => void;
}

export default function buildSectionProps(
  a: BuildArgs,
): Omit<SectionPropsMap, 'preview'> {
  const selectedFont = getFontByName(fonts, a.selectedFontName);
  const multiple = hasMultipleWeights(selectedFont);

  return {
    theme: {
      selectedThemeName: a.selectedThemeName,
      onSelectTheme: a.onSelectTheme,
    },
    accent: {
      selectedAccentColor: a.selectedAccentColor,
      onSelectAccent: a.onSelectAccent,
    },
    divider: {},
    font: {
      selectedFontName: a.selectedFontName,
      onSelectFont: a.onSelectFont,
      onSelectWeight: a.onSelectWeight,
      fontSizeLevel: a.fontSizeLevel,
    },
    fontSize: {
      fontSizeLevel: a.fontSizeLevel,
      onIncrease: a.onIncFontSize,
      onDecrease: a.onDecFontSize,
      blinkIndex: a.sizeBlinkIndex,
      blinkAnim: a.sizeBlinkAnim,
    },
    fontWeight: {
      fontFamilyKey: getFontByName(fonts, a.selectedFontName).family,
      fontWeight: a.fontWeight,
      onIncrease: a.onIncWeight,
      onDecrease: a.onDecWeight,
      blinkAnim: a.weightBlinkAnim,
      disabled: !multiple,
    },
    align: { noteTextAlign: a.noteTextAlign, onChange: a.onAlign },
  };
}

