import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { FONT_SOURCES } from '@constants/fonts';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        const fontMap = Object.fromEntries(
          Object.entries(FONT_SOURCES).flatMap(([family, variants]) =>
            Object.entries(variants).map(([variant, source]) => [
              variant === 'regular' || variant === 'variable'
                ? family
                : `${family}-${variant}`,
              source,
            ]),
          ),
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
