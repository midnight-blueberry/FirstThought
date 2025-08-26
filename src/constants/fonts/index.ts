export * from './types';
export { FAMILIES } from './families';
export { WEIGHTS } from './weights';
export { FONT_VARIANTS } from './variants';
export { FONT_ALIASES } from './aliases';

import type { FontFamily, FontWeight, FontSource } from './types';
import { FAMILIES } from './families';
import { FONT_VARIANTS } from './variants';
import { getFontByName, adjustWeight } from '@utils/fontHelpers';

const DEFAULT_FONT_SIZES = {
  [FAMILIES.Bad_Script]: 22,
  [FAMILIES.Comfortaa]: 18,
  [FAMILIES.Lora]: 18,
  [FAMILIES.Montserrat]: 18,
  [FAMILIES.Nata_Sans]: 18,
  [FAMILIES.PT_Sans]: 18,
  [FAMILIES.Raleway]: 18,
  [FAMILIES.Roboto_Condensed]: 18,
  [FAMILIES.Roboto_Slab]: 18,
} as const satisfies Record<FontFamily, number>;

export const fonts = (Object.keys(FONT_VARIANTS) as FontFamily[]).map(family => {
  const variants = FONT_VARIANTS[family];
  const weights = Object.keys(variants) as FontWeight[];
  const defaultWeight = weights.includes('500' as FontWeight)
    ? ('500' as FontWeight)
    : weights[0];
  return {
    name: family.replace(/_/g, ' '),
    family,
    weights: weights.sort(),
    files: Object.fromEntries(
      weights.map(w => [w, variants[w].normal])
    ) as Record<FontWeight, FontSource>,
    defaultSize: DEFAULT_FONT_SIZES[family],
    defaultWeight,
  };
});

export const defaultFontName: string = 'Comfortaa';

export const getFontFamily = (family: string, weight: string) => `${family}_${weight}`;

export const getNextFontWeight = (family: string, currentWeight: string) => {
  const name = family.replace(/_/g, ' ');
  const font = getFontByName(fonts, name);
  const next = adjustWeight(font, currentWeight, 1);
  return next ?? currentWeight;
};
