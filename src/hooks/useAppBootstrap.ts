import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { fonts, getFontFamily } from '@constants/fonts';
import { loadSettings } from '@storage/settings';
import type { SavedSettings } from '@types';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);
  const [initialSettings, setInitialSettings] = useState<SavedSettings | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(
          Object.fromEntries(
            fonts.flatMap(f =>
              (f.weights as (keyof typeof f.files)[]).map(w => [
                getFontFamily(f.family, w),
                f.files[w],
              ])
            )
          )
        );

        const saved = await loadSettings();
        setInitialSettings(saved);
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    void prepare();
  }, []);

  return { ready, initialSettings };
}
