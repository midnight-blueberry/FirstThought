import { createContext, useCallback, useContext, useRef } from 'react';
import type { ScrollView, View } from 'react-native';

interface StableAnchorContextValue {
  setAnchor: (ref: View) => void;
  captureBeforeUpdate: () => void;
}

export const StableAnchorContext = createContext<StableAnchorContextValue | null>(null);

export const useStableAnchorContext = () => useContext(StableAnchorContext);

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function useStableAnchor() {
  const anchorRef = useRef<View | null>(null);
  const savedCenterY = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const inProgress = useRef(false);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);

  const setAnchor = useCallback((ref: View) => {
    anchorRef.current = ref;
    ref.measureInWindow((_x, y, _w, h) => {
      savedCenterY.current = y + h / 2;
    });
  }, []);

  const setLastScrollY = useCallback((y: number) => {
    lastScrollY.current = y;
  }, []);

  const captureBeforeUpdate = useCallback(() => {
    if (!anchorRef.current || savedCenterY.current == null || inProgress.current) {
      return;
    }
    inProgress.current = true;
  }, []);

  const setContentSize = useCallback((h: number) => {
    contentHeight.current = h;
  }, []);

  const setViewportHeight = useCallback((h: number) => {
    viewportHeight.current = h;
  }, []);

  const reset = () => {
    anchorRef.current = null;
    savedCenterY.current = null;
    inProgress.current = false;
  };

  const adjustAfterLayout = useCallback(
    async (scrollRef: ScrollView | null, waitForOpaque: () => Promise<void>) => {
      if (!inProgress.current || !anchorRef.current) {
        reset();
        return;
      }
      await waitForOpaque();
      anchorRef.current.measureInWindow((_x2, y2, _w2, h2) => {
        const newCenterY = y2 + h2 / 2;
        const delta = newCenterY - (savedCenterY.current ?? newCenterY);
        const maxY = Math.max(0, contentHeight.current - viewportHeight.current);
        const targetY = clamp(lastScrollY.current + delta, 0, maxY);
        scrollRef?.scrollTo({ y: targetY, animated: false });
        savedCenterY.current = null;
        anchorRef.current = null;
        inProgress.current = false;
      });
    },
    [],
  );

  const contextValue = { setAnchor, captureBeforeUpdate };

  return {
    setAnchor,
    setLastScrollY,
    captureBeforeUpdate,
    adjustAfterLayout,
    setContentSize,
    setViewportHeight,
    contextValue,
  };
}
