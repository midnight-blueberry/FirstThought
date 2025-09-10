import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { ScrollView, View } from 'react-native';

interface AnchorContextValue {
  setAnchor: (ref: View | null) => void;
  captureBeforeUpdate: () => void;
}

export const AnchorStableScrollContext = createContext<AnchorContextValue | null>(null);

export function useAnchorStableScrollContext() {
  return useContext(AnchorStableScrollContext);
}

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export default function useStableAnchor() {
  const anchorRef = useRef<View | null>(null);
  const savedCenterY = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const inProgress = useRef(false);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);

  const setAnchor = useCallback((ref: View | null) => {
    if (ref == null) return;
    anchorRef.current = ref;
    ref.measureInWindow((_x, y, _w, h) => {
      savedCenterY.current = y + h / 2;
    });
  }, []);

  const setLastScrollY = useCallback((y: number) => {
    lastScrollY.current = y;
  }, []);

  const setContentSize = useCallback((h: number) => {
    contentHeight.current = h;
  }, []);

  const setViewportHeight = useCallback((h: number) => {
    viewportHeight.current = h;
  }, []);

  const captureBeforeUpdate = useCallback(() => {
    if (!anchorRef.current || savedCenterY.current == null || inProgress.current) return;
    inProgress.current = true;
  }, []);

  const reset = () => {
    savedCenterY.current = null;
    inProgress.current = false;
  };

  const adjustAfterLayout = useCallback(
    async (scrollView: ScrollView | null | undefined, waitForOpaque: () => Promise<void>) => {
      if (!inProgress.current || !anchorRef.current) {
        reset();
        return;
      }
      await waitForOpaque();
      const ref = anchorRef.current;
      ref.measureInWindow((_x2, y2, _w2, h2) => {
        if (savedCenterY.current == null) {
          reset();
          return;
        }
        const newCenterY = y2 + h2 / 2;
        const delta = newCenterY - savedCenterY.current;
        const maxScroll = Math.max(0, contentHeight.current - viewportHeight.current);
        const targetY = clamp(lastScrollY.current + delta, 0, maxScroll);
        scrollView?.scrollTo({ y: targetY, animated: false });
        reset();
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({ setAnchor, captureBeforeUpdate }),
    [setAnchor, captureBeforeUpdate],
  );

  return {
    setAnchor,
    setLastScrollY,
    captureBeforeUpdate,
    adjustAfterLayout,
    setContentSize,
    setViewportHeight,
    contextValue,
  } as const;
}

export type UseStableAnchorReturn = ReturnType<typeof useStableAnchor>;
