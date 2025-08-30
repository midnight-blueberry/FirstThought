import type { FontFamily, FontWeight } from './types';

export const AVAILABLE_WEIGHTS: Record<FontFamily, FontWeight[]> = {
  Bad_Script: ['400'],
  Comfortaa: ['300', '400', '500', '600', '700'],
  Lora: ['400', '500', '600', '700'],
  Montserrat: ['300', '400', '500', '600', '700'],
  Nata_Sans: ['300', '400', '500', '600', '700'],
  PT_Sans: ['400', '700'],
  Raleway: ['300', '400', '500', '600', '700'],
  Roboto_Condensed: ['300', '400', '500', '600', '700'],
  Roboto_Slab: ['300', '400', '500', '600', '700'],
} as const;
