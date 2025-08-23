import type { ComponentType } from 'react';
import AccentColorSelector from '@/components/ui/organisms/accent-color-selector';
import Divider from '@/components/ui/atoms/divider';
import FontSelector from '@/components/ui/organisms/font-selector';
import FontSizeSelector from '@/components/ui/organisms/font-size-selector';
import FontWeightSelector from '@/components/ui/organisms/font-weight-selector';
import PreviewNote from '@/components/ui/organisms/preview-note';
import TextAlignSelector from '@/components/ui/organisms/text-align-selector';
import ThemeSelector from '@/components/ui/organisms/theme-selector';
import type { SectionKey, SectionPropsMap } from './SectionPropsMap';

export const sections = [
  { key: 'theme', Component: ThemeSelector },
  { key: 'accent', Component: AccentColorSelector },
  { key: 'divider', Component: Divider },
  { key: 'font', Component: FontSelector },
  { key: 'fontSize', Component: FontSizeSelector },
  { key: 'fontWeight', Component: FontWeightSelector },
  { key: 'align', Component: TextAlignSelector },
  { key: 'preview', Component: PreviewNote },
] as const satisfies ReadonlyArray<{
  [K in SectionKey]: { key: K; Component: ComponentType<SectionPropsMap[K]> };
}[SectionKey]>;

export type { SectionKey };
