import { useCallback } from 'react';
import {
  ScrollView,
  View,
  UIManager,
  findNodeHandle,
} from 'react-native';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

let anchorRef: View | number | null = null;
let oldAnchorY = 0;
let scrollY = 0;
let inProgress = false;

function measureLayoutAsync(anchor: number, relativeTo: number): Promise<number> {
  return new Promise((resolve) => {
    UIManager.measureLayout(
      anchor,
      relativeTo,
      () => resolve(0),
      (_x, y) => resolve(y),
    );
  });
}

function measureScrollYAsync(scroll: ScrollView): Promise<number> {
  return new Promise((resolve) => {
    const node = (scroll as any).getScrollableNode
      ? (scroll as any).getScrollableNode()
      : findNodeHandle(scroll);
    if (!node) {
      resolve(0);
      return;
    }
    UIManager.measure(node, (_x, y) => {
      resolve(-y);
    });
  });
}

export default function useAnchorStableScroll() {
  const overlay = useOverlayTransition();

  const setAnchor = useCallback((ref: View | number | null) => {
    anchorRef = ref;
  }, []);

  const captureBeforeUpdate = useCallback(async (scroll: ScrollView | null) => {
    if (inProgress) return;
    if (!anchorRef || !scroll) return;
    const anchorHandle =
      typeof anchorRef === 'number' ? anchorRef : findNodeHandle(anchorRef);
    const scrollHandle = findNodeHandle(scroll);
    if (anchorHandle == null || scrollHandle == null) return;
    try {
      oldAnchorY = await measureLayoutAsync(anchorHandle, scrollHandle);
      scrollY = await measureScrollYAsync(scroll);
      inProgress = true;
    } catch {
      // ignore
    }
  }, []);

  const adjustAfterLayout = useCallback(
    async (scroll: ScrollView | null) => {
      if (!inProgress) return;
      const run = async () => {
        const anchor = anchorRef;
        if (!anchor || !scroll) {
          inProgress = false;
          return;
        }
        const anchorHandle =
          typeof anchor === 'number' ? anchor : findNodeHandle(anchor);
        const scrollHandle = findNodeHandle(scroll);
        if (anchorHandle == null || scrollHandle == null) {
          inProgress = false;
          return;
        }
        try {
          const newAnchorY = await measureLayoutAsync(anchorHandle, scrollHandle);
          const nextScroll = scrollY + (newAnchorY - oldAnchorY);
          scroll.scrollTo({ y: nextScroll, animated: false });
        } finally {
          anchorRef = null;
          inProgress = false;
        }
      };

      const start = Date.now();
      const check = () => {
        if (!overlay || overlay.getOpacity() >= 1 || Date.now() - start > 300) {
          void run();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    },
    [overlay],
  );

  return { setAnchor, captureBeforeUpdate, adjustAfterLayout };
}

