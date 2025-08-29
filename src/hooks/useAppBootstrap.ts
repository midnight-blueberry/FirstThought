import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { fonts, getFontFamily } from '@constants/fonts';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

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
