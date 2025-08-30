import type { FontFamily, FontSource } from './types';
import { AVAILABLE_WEIGHTS } from './available-weights';
import { FONT_VARIANTS } from './variants';

const getFontFamily = (family: string, weight: string) => `${family}_${weight}`;

export function getRegisteredFonts(): Record<string, FontSource> {
  const entries: [string, FontSource][] = [];
  (Object.keys(AVAILABLE_WEIGHTS) as FontFamily[]).forEach((family) => {
    const variants = FONT_VARIANTS[family] as Record<string, { normal?: FontSource }>;
    AVAILABLE_WEIGHTS[family].forEach((weight) => {
      const source = variants[weight]?.normal;
      if (source) {
        entries.push([getFontFamily(family, weight), source]);
      }
    });
  });
  return Object.fromEntries(entries);
}
