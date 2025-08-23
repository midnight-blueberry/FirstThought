import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { fonts, getFontFamily } from '@/constants/Fonts';
import { loadSettings } from '@/src/storage/settings';
import { buildTheme } from '@/src/theme/buildTheme';
import { themes } from '@/constants/theme';

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
