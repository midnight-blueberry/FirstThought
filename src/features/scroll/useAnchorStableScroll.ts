import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { RefObject } from 'react';
import { UIManager, findNodeHandle, ScrollView } from 'react-native';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';

interface AnchorContextValue {
  setAnchor: (ref: any, mode?: 'top' | 'center') => void;
  captureBeforeUpdate: () => void;
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
  const capturedScrollY = useRef(0);
  const oldAnchorPos = useRef(0);
  const inProgress = useRef(false);
  const overlay = useOverlayTransition();

  const setAnchor = useCallback(
    (ref: any, mode: 'top' | 'center' = 'top') => {
      const handle = typeof ref === 'number' ? ref : findNodeHandle(ref);
      if (handle != null) {
        anchorHandle.current = handle;
        anchorMode.current = mode;
      }
    },
    [],
  );

  const setLastScrollY = useCallback((y: number) => {
    lastScrollY.current = y;
  }, []);

  const captureBeforeUpdate = useCallback(() => {
    if (inProgress.current) return;
    const anchor = anchorHandle.current;
    const scrollNode = findNodeHandle(scrollRef.current);
    if (anchor == null || scrollNode == null) return;
    inProgress.current = true;
    capturedScrollY.current = lastScrollY.current;
    UIManager.measureLayout(
      anchor,
      scrollNode,
      () => {
        inProgress.current = false;
      },
      (_x, y, _w, h) => {
        const top = y + capturedScrollY.current;
        oldAnchorPos.current =
          anchorMode.current === 'center' ? top + h / 2 : top;
      },
    );
  }, []);

  const adjustAfterLayout = useCallback(async () => {
    if (!inProgress.current) return;
    const anchor = anchorHandle.current;
    const scrollNode = findNodeHandle(scrollRef.current);
    const scrollView = scrollRef.current;
    if (anchor == null || scrollNode == null || !scrollView) {
      inProgress.current = false;
      anchorHandle.current = null;
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
        const top = y + capturedScrollY.current;
        const newAnchorPos =
          anchorMode.current === 'center' ? top + h / 2 : top;
        let targetY =
          capturedScrollY.current + (newAnchorPos - oldAnchorPos.current);

        const innerNode = (scrollView as any).getInnerViewNode?.();
        UIManager.measure(scrollNode, (_ax, _ay, _aw, viewportHeight) => {
          UIManager.measure(
            innerNode ?? scrollNode,
            (_bx, _by, _bw, contentHeight) => {
              const maxY = Math.max(0, contentHeight - viewportHeight);
              if (targetY < 0) targetY = 0;
              else if (targetY > maxY) targetY = maxY;
              scrollView.scrollTo({ y: targetY, animated: false });
              inProgress.current = false;
              anchorHandle.current = null;
            },
          );
        });
      },
    );
  }, [overlay]);

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

