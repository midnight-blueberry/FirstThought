import type { SectionPropsMap } from '@types';
import type { DefaultTheme } from 'styled-components/native';
// Removed unused font helpers after refactor

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
  onSelectWeight: (w: DefaultTheme['fontWeight']) => void;
  onIncFontSize: () => void;
  onDecFontSize: () => void;
  onIncWeight: () => void;
  onDecWeight: () => void;
  onAlign: (a: DefaultTheme['noteTextAlign']) => void;
}

export default function buildSectionProps(
  a: BuildArgs,
): Omit<SectionPropsMap, 'preview'> {

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
      fontWeight: a.fontWeight,
      onIncrease: a.onIncWeight,
      onDecrease: a.onDecWeight,
      onSelect: a.onSelectWeight,
      blinkAnim: a.weightBlinkAnim,
    },
    align: { noteTextAlign: a.noteTextAlign, onChange: a.onAlign },
  };
}

