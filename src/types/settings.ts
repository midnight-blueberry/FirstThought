import type { Animated, View } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';
import type { ComponentProps } from 'react';
import type { Divider } from '@components/ui/atoms';
import type { PreviewNote } from '@components/ui/organisms';

export interface AnchorStableScrollHandlers {
  setAnchor?: (ref: View | number | null) => void;
  captureBeforeUpdate?: () => void;
}

export interface AppSettings {
  themeName: string;
  accentColor: string;
  fontSizeLevel: number;
  fontName: string;
  fontWeight: DefaultTheme['fontWeight'];
  iconSize: DefaultTheme['iconSize'];
  noteTextAlign: DefaultTheme['noteTextAlign'];
}

export interface SavedSettings {
  themeName?: string;
  accentColor?: string;
  fontName?: string;
  fontWeight?: DefaultTheme['fontWeight'];
  fontSizeLevel?: number;
  iconSize?: DefaultTheme['iconSize'];
  noteTextAlign?: DefaultTheme['noteTextAlign'];
}

export type SavedSettingsPatch = SavedSettings;

export interface ThemeSelectorProps extends AnchorStableScrollHandlers {
  selectedThemeName: string;
  onSelectTheme: (name: string) => void;
}

export interface AccentColorSelectorProps extends AnchorStableScrollHandlers {
  selectedAccentColor: string;
  onSelectAccent: (color: string) => void;
}

export interface FontSelectorProps extends AnchorStableScrollHandlers {
  selectedFontName: string;
  onSelectFont: (name: string) => void;
  fontSizeLevel: number;
}

export interface FontSizeSelectorProps extends AnchorStableScrollHandlers {
  fontSizeLevel: number;
  onIncrease: () => void;
  onDecrease: () => void;
  blinkIndex: number | null;
  blinkAnim: Animated.Value;
}

export interface FontWeightSelectorProps extends AnchorStableScrollHandlers {
  fontWeight: DefaultTheme['fontWeight'];
  onIncrease: () => void;
  onDecrease: () => void;
  onSelect: (weight: DefaultTheme['fontWeight']) => void;
  blinkAnim: Animated.Value;
  disabled: boolean;
}

export interface TextAlignSelectorProps extends AnchorStableScrollHandlers {
  noteTextAlign: DefaultTheme['noteTextAlign'];
  onChange: (value: DefaultTheme['noteTextAlign']) => void;
}

export interface SectionPropsMap {
  theme: ThemeSelectorProps;
  accent: AccentColorSelectorProps;
  divider: ComponentProps<typeof Divider>;
  font: FontSelectorProps;
  fontSize: FontSizeSelectorProps;
  fontWeight: FontWeightSelectorProps;
  align: TextAlignSelectorProps;
  preview: ComponentProps<typeof PreviewNote>;
}

export type SectionKey = keyof SectionPropsMap;
