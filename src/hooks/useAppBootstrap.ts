import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { fonts, getFontFamily } from '@constants/fonts';
import { loadSettings } from '@storage/settings';
import { buildTheme, themes } from '@theme/buildTheme';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(themes.light);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(
          Object.fromEntries(
            fonts.flatMap((f) =>
              (f.weights as (keyof typeof f.files)[]).map((w) => [
                getFontFamily(f.family, w),
                f.files[w],
              ])
            )
          )
        );

        const saved = await loadSettings();
        setTheme(buildTheme(saved ?? undefined));
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    void prepare();
  }, []);

  return { ready, theme, setTheme };
}
