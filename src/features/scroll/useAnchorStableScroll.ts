import React, { createContext, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import {
  UIManager,
  findNodeHandle,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useOverlayTransition } from '@/components/settings/overlay';

interface AnchorContextValue {
  setAnchor: (ref: any) => void;
  captureBeforeUpdate: () => void;
}

export const AnchorStableScrollContext = createContext<AnchorContextValue | null>(null);

export default function useAnchorStableScroll() {
  const scrollRef = useRef<ScrollView>(null);
  const anchorHandle = useRef<number | null>(null);
  const scrollY = useRef(0);
  const oldAnchorY = useRef(0);
  const inProgress = useRef(false);
  const overlay = useOverlayTransition();

  const setAnchor = useCallback((ref: any) => {
    const handle = typeof ref === 'number' ? ref : findNodeHandle(ref);
    if (handle != null) {
      anchorHandle.current = handle;
    }
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.current = e.nativeEvent.contentOffset.y;
  }, []);

  const captureBeforeUpdate = useCallback(() => {
    if (inProgress.current) return;
    const anchor = anchorHandle.current;
    const scrollNode = findNodeHandle(scrollRef.current);
    if (anchor == null || scrollNode == null) return;
    inProgress.current = true;
    UIManager.measureLayout(
      anchor,
      scrollNode,
      () => {
        inProgress.current = false;
      },
      (_x, y) => {
        oldAnchorY.current = y + scrollY.current;
      },
    );
  }, []);

  const adjustAfterLayout = useCallback(() => {
    if (!inProgress.current) return;
    const anchor = anchorHandle.current;
    const scrollNode = findNodeHandle(scrollRef.current);
    const scrollView = scrollRef.current;
    if (anchor == null || scrollNode == null || !scrollView) {
      inProgress.current = false;
      return;
    }

    const perform = () => {
      UIManager.measureLayout(
        anchor,
        scrollNode,
        () => {
          inProgress.current = false;
          anchorHandle.current = null;
        },
        (_x, y) => {
          const newAnchorY = y + scrollY.current;
          const diff = newAnchorY - oldAnchorY.current;
          if (diff !== 0) {
            scrollView.scrollTo({ y: scrollY.current + diff, animated: false });
          }
          inProgress.current = false;
          anchorHandle.current = null;
        },
      );
    };

    if (overlay && typeof overlay.isOpaque === 'function') {
      const start = Date.now();
      const check = () => {
        if (overlay.isOpaque() || Date.now() - start > 300) {
          perform();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    } else {
      perform();
    }
  }, [overlay]);

  const contextValue = React.useMemo(
    () => ({ setAnchor, captureBeforeUpdate }),
    [setAnchor, captureBeforeUpdate],
  );

  return { scrollRef: scrollRef as RefObject<ScrollView>, handleScroll, adjustAfterLayout, contextValue };
}

