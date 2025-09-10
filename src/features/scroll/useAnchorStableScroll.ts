import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { RefObject } from 'react';
import { UIManager, findNodeHandle, ScrollView, View } from 'react-native';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';

interface AnchorContextValue {
  setAnchor: (ref: View, mode?: 'top' | 'center') => void;
  captureBeforeUpdate: (scrollView?: ScrollView | null) => void;
}

export const AnchorStableScrollContext = createContext<AnchorContextValue | null>(null);

export function useAnchorStableScrollContext() {
  return useContext(AnchorStableScrollContext);
}

export default function useAnchorStableScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const anchorHandle = useRef<number | null>(null);
  const anchorMode = useRef<'top' | 'center'>('top');
  const oldAnchorPos = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollSnapshot = useRef(0);
  const inProgress = useRef(false);
  const overlay = useOverlayTransition();

  const setAnchor = useCallback((ref: View, mode: 'top' | 'center' = 'top') => {
    const handle = typeof ref === 'number' ? ref : findNodeHandle(ref);
    if (handle != null) {
      anchorHandle.current = handle;
      anchorMode.current = mode;
    }
  }, []);

  const setLastScrollY = useCallback((y: number) => {
    lastScrollY.current = y;
  }, []);

  const captureBeforeUpdate = useCallback((scrollView?: ScrollView | null) => {
    if (inProgress.current) return;
    const anchor = anchorHandle.current;
    const sv = scrollView ?? scrollRef.current;
    const scrollNode = findNodeHandle(sv);
    if (anchor == null || scrollNode == null) return;
    inProgress.current = true;
    lastScrollSnapshot.current = lastScrollY.current;
    UIManager.measureLayout(
      anchor,
      scrollNode,
      () => {
        inProgress.current = false;
      },
      (_x, y, _w, h) => {
        const top = y + lastScrollSnapshot.current;
        oldAnchorPos.current =
          anchorMode.current === 'center' ? top + h / 2 : top;
      },
    );
  }, []);

  const adjustAfterLayout = useCallback(
    async (scrollView?: ScrollView | null) => {
      if (!inProgress.current) return;
      const sv = scrollView ?? scrollRef.current;
      const anchor = anchorHandle.current;
      const scrollNode = findNodeHandle(sv);
      if (!sv || anchor == null || scrollNode == null) {
        inProgress.current = false;
        return;
      }

      await waitForOpaque(overlay);

      UIManager.measureLayout(
        anchor,
        scrollNode,
        () => {
          inProgress.current = false;
          anchorHandle.current = null;
        },
        (_x, y, _w, h) => {
          const lastY = lastScrollSnapshot.current;
          const top = y + lastY;
          const newAnchorPos =
            anchorMode.current === 'center' ? top + h / 2 : top;

          const innerHandle =
            typeof (sv as any).getInnerViewNode === 'function'
              ? findNodeHandle((sv as any).getInnerViewNode())
              : null;

          UIManager.measure(scrollNode, (_sx, _sy, _sw, viewportHeight) => {
            const finish = (contentHeight: number) => {
              let targetY = lastY + (newAnchorPos - oldAnchorPos.current);
              const maxY = Math.max(0, contentHeight - viewportHeight);
              if (targetY < 0) targetY = 0;
              if (targetY > maxY) targetY = maxY;
              sv.scrollTo({ y: targetY, animated: false });
              inProgress.current = false;
              anchorHandle.current = null;
            };

            if (innerHandle != null) {
              UIManager.measure(innerHandle, (_ix, _iy, _iw, contentHeight) =>
                finish(contentHeight),
              );
            } else {
              finish(viewportHeight);
            }
          });
        },
      );
    },
    [overlay],
  );

  const contextValue = React.useMemo(
    () => ({ setAnchor, captureBeforeUpdate }),
    [setAnchor, captureBeforeUpdate],
  );

  return {
    scrollRef: scrollRef as RefObject<ScrollView>,
    setLastScrollY,
    adjustAfterLayout,
    contextValue,
  };
}

