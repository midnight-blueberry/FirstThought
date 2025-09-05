import type { SectionPropsMap } from '@types';
import type { DefaultTheme } from 'styled-components/native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export interface SettingsItem {
  key: keyof SectionPropsMap;
}

export interface SettingsVm {
  sectionProps: SectionPropsMap;
  theme: DefaultTheme;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  save: () => Promise<void>;
  dirty: boolean;
}

