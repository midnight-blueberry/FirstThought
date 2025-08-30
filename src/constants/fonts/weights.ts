import type { FontFamily, FontWeight } from './types';

export const FONT_WEIGHTS_BY_FAMILY: Record<FontFamily, readonly FontWeight[]> = {
  Bad_Script: [400],
  Comfortaa: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  Lora: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  Nata_Sans: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  PT_Sans: [400, 700],
  Raleway: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  Roboto_Condensed: [100, 200, 300, 400, 500, 600, 700, 800, 900],
  Roboto_Slab: [100, 200, 300, 400, 500, 600, 700, 800, 900],
} as const;
