import type { SectionPropsMap } from '@types';
import type { DefaultTheme } from 'styled-components/native';
import type {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export interface SettingsItem {
  key: keyof SectionPropsMap;
}

export interface SettingsVm {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  overlayVisible: boolean;
  overlayColor: string;
  overlayAnim: Animated.Value;
  overlayBlocks: boolean;
  settingsVersion: number;
}

