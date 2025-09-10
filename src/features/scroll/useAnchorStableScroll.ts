import { useCallback, useRef } from 'react';
import { ScrollView, UIManager, findNodeHandle } from 'react-native';
import type { View } from 'react-native';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

export default function useAnchorStableScroll() {
  const anchorRef = useRef<number | null>(null);
  const oldAnchorY = useRef(0);
  const scrollYRef = useRef(0);
  const inProgress = useRef(false);
  const overlay = useOverlayTransition();

  const setAnchor = useCallback((ref: View | number | null) => {
    const handle = typeof ref === 'number' ? ref : findNodeHandle(ref);
    if (handle != null) {
      anchorRef.current = handle;
    }
  }, []);

  const measureRelativeY = (target: number, relativeTo: number) =>
    new Promise<number>((resolve) => {
      UIManager.measureLayout(
        target,
        relativeTo,
        () => resolve(0),
        (_x, y) => resolve(y),
      );
    });

  const measureWindowY = (handle: number) =>
    new Promise<number>((resolve) => {
      UIManager.measureInWindow(handle, (_x, y) => resolve(y));
    });

  const captureBeforeUpdate = useCallback(
    async (scrollRef: ScrollView | null) => {
      const anchor = anchorRef.current;
      if (!anchor || !scrollRef) return;
      const scrollHandle = findNodeHandle(scrollRef);
      if (!scrollHandle) return;
      try {
        const [anchorY, anchorWinY, scrollWinY] = await Promise.all([
          measureRelativeY(anchor, scrollHandle),
          measureWindowY(anchor),
          measureWindowY(scrollHandle),
        ]);
        oldAnchorY.current = anchorY;
        scrollYRef.current = scrollWinY + anchorY - anchorWinY;
        inProgress.current = true;
      } catch {
        // ignore
      }
    },
    [],
  );

  const reset = () => {
    inProgress.current = false;
    anchorRef.current = null;
  };

  const adjustAfterLayout = useCallback(
    (scrollRef: ScrollView | null) => {
      if (!inProgress.current) return;
      const anchor = anchorRef.current;
      if (!anchor || !scrollRef) {
        reset();
        return;
      }
      const scrollHandle = findNodeHandle(scrollRef);
      if (!scrollHandle) {
        reset();
        return;
      }

      const start = Date.now();
      const attempt = () => {
        if (overlay.getOpacity() < 1) {
          if (Date.now() - start > 300) {
            reset();
            return;
          }
          requestAnimationFrame(attempt);
          return;
        }
        UIManager.measureLayout(
          anchor,
          scrollHandle,
          () => reset(),
          (_x, y) => {
            const diff = y - oldAnchorY.current;
            scrollRef.scrollTo({ y: scrollYRef.current + diff, animated: false });
            reset();
          },
        );
      };
      attempt();
    },
    [overlay],
  );

  return { setAnchor, captureBeforeUpdate, adjustAfterLayout };
}

