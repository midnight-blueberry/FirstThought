// src/constants/fonts/variants.ts
import type { FontFamily, FontWeight, FontSource } from './types';
import { FONT_FILES } from './files';

type Variants = Readonly<
  Record<FontFamily, Partial<Record<FontWeight, Partial<Record<'normal', FontSource>>>>>
>;

// Преобразуем числовые ключи из FONT_FILES в строковые '100' | '200' ... для совместимости с типами
export const FONT_VARIANTS: Variants = Object.freeze(
  Object.fromEntries(
    Object.entries(FONT_FILES).map(([family, weightsMap]) => {
      const entries = Object.entries(weightsMap).map(([w, file]) => [
        String(w) as FontWeight,
        { normal: file as FontSource },
      ]);
      return [family as FontFamily, Object.fromEntries(entries)];
    })
  ) as Variants
);
