import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeName = 'light' | 'dark' | 'system';

const KEY = 'ft:theme';

/**
 * Saves current theme to AsyncStorage when `theme` changes.
 * Debounced and avoids redundant writes.
 */
export function useThemeSaver(theme: ThemeName): { saving: boolean; error: string | null } {
  const lastSavedRef = useRef<ThemeName | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (lastSavedRef.current === theme) return;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void (async () => {
        try {
          if (lastSavedRef.current === null) {
            const stored = await AsyncStorage.getItem(KEY);
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
              lastSavedRef.current = stored;
            }
          }
          if (lastSavedRef.current !== theme) {
            if (mountedRef.current) {
              setSaving(true);
              setError(null);
            }
            await AsyncStorage.setItem(KEY, theme);
            lastSavedRef.current = theme;
          }
        } catch (e) {
          if (mountedRef.current) {
            setError(e instanceof Error ? e.message : String(e));
          }
        } finally {
          if (mountedRef.current) setSaving(false);
        }
      })();
    }, 250);
  }, [theme]);

  return { saving, error };
}
