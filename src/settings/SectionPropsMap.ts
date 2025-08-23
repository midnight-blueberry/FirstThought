import type { ComponentProps } from 'react';
import type { Divider } from '@components/ui/atoms';
import type { PreviewNote } from '@components/ui/organisms';
import type {
  ThemeSelectorProps,
  AccentColorSelectorProps,
  FontSelectorProps,
  FontSizeSelectorProps,
  FontWeightSelectorProps,
  TextAlignSelectorProps,
} from './types';

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
