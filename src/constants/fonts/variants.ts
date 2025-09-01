// src/constants/fonts/variants.ts
import { FONT_FILES } from "./files";
import { fontKey } from "./resolve";

// Список доступных весов по каждому семейству
export const FONT_VARIANTS: Readonly<Record<string, readonly number[]>> =
  Object.freeze(
    Object.fromEntries(
      Object.entries(FONT_FILES).map(([family, weightsMap]) => [
        family,
        Object.keys(weightsMap)
          .map(Number)
          .sort((a, b) => a - b),
      ])
    )
  );

// Ключи для fontFamily в формате Family-Weight (например, Comfortaa-400)
export const FONT_KEYS: Readonly<Record<string, Readonly<Record<number, string>>>> =
  Object.freeze(
    Object.fromEntries(
      Object.entries(FONT_FILES).map(([family, weightsMap]) => [
        family,
        Object.freeze(
          Object.fromEntries(
            Object.keys(weightsMap).map((w) => {
              const weight = Number(w);
              return [weight, fontKey(family, weight)];
            })
          )
        ),
      ])
    )
  );
