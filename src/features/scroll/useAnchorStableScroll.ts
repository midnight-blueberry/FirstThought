import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { RefObject } from 'react';
import {
  UIManager,
  findNodeHandle,
  ScrollView,
  View,
} from 'react-native';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';

interface AnchorContextValue {
  setAnchor: (ref: View, mode?: 'top' | 'center') => void;
  captureBeforeUpdate: (sv?: ScrollView | null) => void;
}

export const AnchorStableScrollContext = createContext<AnchorContextValue | null>(null);

export function useAnchorStableScrollContext() {
  return useContext(AnchorStableScrollContext);
}

export default function useAnchorStableScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const anchorHandle = useRef<number | null>(null);
  const anchorMode = useRef<'top' | 'center'>('top');
  const lastScrollY = useRef(0);
  const lastScrollYSnapshot = useRef(0);
  const oldAnchorPos = useRef(0);
  const inProgress = useRef(false);
  const overlay = useOverlayTransition();

  const setAnchor = useCallback((ref: View, mode: 'top' | 'center' = 'top') => {
    const handle = findNodeHandle(ref);
    if (handle != null) {
      anchorHandle.current = handle;
      anchorMode.current = mode;
    }
  }, []);

  const setLastScrollY = useCallback((y: number) => {
    lastScrollY.current = y;
  }, []);

  const captureBeforeUpdate = useCallback((sv?: ScrollView | null) => {
    if (inProgress.current) return;
    const anchor = anchorHandle.current;
    const scrollView = sv ?? scrollRef.current;
    const contentNodeHandle = scrollView?.getInnerViewNode
      ? findNodeHandle(scrollView.getInnerViewNode())
      : null;
    if (anchor == null || contentNodeHandle == null) return;
    inProgress.current = true;
    lastScrollYSnapshot.current = lastScrollY.current;
    UIManager.measureLayout(
      anchor,
      contentNodeHandle,
      () => {
        inProgress.current = false;
      },
      (_x, top, _w, height) => {
        oldAnchorPos.current =
          anchorMode.current === 'center' ? top + height / 2 : top;
      },
    );
  }, []);

  const adjustAfterLayout = useCallback(
    async (sv?: ScrollView | null) => {
      if (!inProgress.current) return;
      const anchor = anchorHandle.current;
      const scrollView = sv ?? scrollRef.current;
      const contentNodeHandle = scrollView?.getInnerViewNode
        ? findNodeHandle(scrollView.getInnerViewNode())
        : null;
      const scrollNode = scrollView ? findNodeHandle(scrollView) : null;
      if (anchor == null || !scrollView || contentNodeHandle == null || scrollNode == null) {
        inProgress.current = false;
        anchorHandle.current = null;
        return;
      }

      await waitForOpaque(overlay);

      UIManager.measureLayout(
        anchor,
        contentNodeHandle,
        () => {
          inProgress.current = false;
          anchorHandle.current = null;
        },
        (_x, top, _w, height) => {
          const newAnchorPos =
            anchorMode.current === 'center' ? top + height / 2 : top;
          UIManager.measure(scrollNode, (_a, _b, _c, viewportHeight) => {
            UIManager.measure(contentNodeHandle, (_d, _e, _f, contentHeight) => {
              let targetY =
                lastScrollYSnapshot.current + (newAnchorPos - oldAnchorPos.current);
              const maxY = Math.max(0, contentHeight - viewportHeight);
              if (targetY < 0) targetY = 0;
              if (targetY > maxY) targetY = maxY;
              scrollView.scrollTo({ y: targetY, animated: false });
              inProgress.current = false;
              anchorHandle.current = null;
            });
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

