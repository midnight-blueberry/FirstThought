import type { FontFamily, FontWeight } from './types';
import { FAMILIES } from './families';

export const WEIGHTS = {
  [FAMILIES.Bad_Script]: ['400'],
  [FAMILIES.Comfortaa]: ['300', '400', '500', '600', '700'],
  [FAMILIES.Lora]: ['400', '500', '600', '700'],
  [FAMILIES.Montserrat]: ['300', '400', '500', '600', '700'],
  [FAMILIES.Nata_Sans]: ['300', '400', '500', '600', '700'],
  [FAMILIES.PT_Sans]: ['400', '700'],
  [FAMILIES.Raleway]: ['300', '400', '500', '600', '700'],
  [FAMILIES.Roboto_Condensed]: ['300', '400', '500', '600', '700'],
  [FAMILIES.Roboto_Slab]: ['300', '400', '500', '600', '700'],
} as const satisfies Record<FontFamily, ReadonlyArray<FontWeight>>;
