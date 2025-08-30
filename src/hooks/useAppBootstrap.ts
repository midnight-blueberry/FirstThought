import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { FONT_FILES } from '@constants/fonts';

export function useAppBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(FONT_FILES);
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
