import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { ScrollView, View } from 'react-native';

interface AnchorContextValue {
  setAnchor: (ref: View | null) => void;
  captureBeforeUpdate: () => void;
}

export const AnchorStableScrollContext = createContext<AnchorContextValue | null>(
  null,
);

export function useAnchorStableScrollContext() {
  return useContext(AnchorStableScrollContext);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export default function useStableAnchor() {
  const anchorRef = useRef<View | null>(null);
  const savedCenterY = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const inProgress = useRef(false);
  const contentHeight = useRef(0);
  const viewportHeight = useRef(0);

  const setAnchor = useCallback((ref: View | null) => {
    if (!ref) return;
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
    if (!anchorRef.current || savedCenterY.current == null || inProgress.current)
      return;
    inProgress.current = true;
  }, []);

  const reset = () => {
    anchorRef.current = null;
    savedCenterY.current = null;
    inProgress.current = false;
  };

  const adjustAfterLayout = useCallback(
    async (
      scrollRef: ScrollView | null | undefined,
      waitForOpaque: () => Promise<void>,
    ) => {
      if (!inProgress.current || !anchorRef.current || !scrollRef) {
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
        const maxY = Math.max(0, contentHeight.current - viewportHeight.current);
        const targetY = clamp(lastScrollY.current + delta, 0, maxY);
        scrollRef.scrollTo({ y: targetY, animated: false });
        savedCenterY.current = null;
        inProgress.current = false;
      });
    },
    [],
  );

  const contextValue = React.useMemo(
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
  };
}

export type { AnchorContextValue };
