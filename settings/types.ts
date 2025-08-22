import type { Animated } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

export interface SavedSettingsPatch {
  themeName?: string;
  accentColor?: string;
  fontName?: string;
  fontWeight?: DefaultTheme['fontWeight'];
  fontSizeLevel?: number;
  iconSize?: DefaultTheme['iconSize'];
  noteTextAlign?: DefaultTheme['noteTextAlign'];
}

export interface ThemeSelectorProps {
  selectedThemeName: string;
  onSelectTheme: (name: string) => void;
}

export interface AccentColorSelectorProps {
  selectedAccentColor: string;
  onSelectAccent: (color: string) => void;
}

export interface FontSelectorProps {
  selectedFontName: string;
  onSelectFont: (name: string) => void;
  onSelectWeight: (weight: DefaultTheme['fontWeight']) => void;
  fontSizeLevel: number;
}

export interface FontSizeSelectorProps {
  fontSizeLevel: number;
  onIncrease: () => void;
  onDecrease: () => void;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
}

export interface FontWeightSelectorProps {
  fontWeight: DefaultTheme['fontWeight'];
  onIncrease: () => void;
  onDecrease: () => void;
  blinkAnim: Animated.Value;
  disabled: boolean;
}

export interface TextAlignSelectorProps {
  noteTextAlign: DefaultTheme['noteTextAlign'];
  onChange: (value: DefaultTheme['noteTextAlign']) => void;
}

