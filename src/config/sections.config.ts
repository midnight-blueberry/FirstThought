import type { ComponentType } from 'react';
import { Divider } from '@components/ui/atoms';
import {
  AccentColorSelector,
  FontSelector,
  FontSizeSelector,
  FontWeightSelector,
  PreviewNote,
  TextAlignSelector,
  ThemeSelector,
} from '@components/ui/organisms';
import type { SectionKey, SectionPropsMap } from '@types';

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

export type { SectionKey } from '@types';
