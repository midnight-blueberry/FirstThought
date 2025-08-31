import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { FONT_SOURCES, FONT_WEIGHTS_BY_FAMILY } from '@constants/fonts';
import type { FontFamily, FontWeight } from '@constants/fonts';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const fontMap = Object.fromEntries(
          Object.entries(FONT_SOURCES).flatMap(([family, variants]) => {
            const weights = FONT_WEIGHTS_BY_FAMILY[family as FontFamily];
            if ('variable' in variants) {
              return [[family, (variants as Record<string, Font.FontSource>).variable]];
            }
            return (weights as FontWeight[]).map(weight => {
              const key = weight === 400 ? 'regular' : weight === 700 ? 'bold' : String(weight);
              const source = (variants as Record<string, Font.FontSource>)[key];
              return [`${family}-${weight}`, source];
            });
          }),
        );
        await Font.loadAsync(fontMap);
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    void prepare();
  }, []);

  return { ready };
}
