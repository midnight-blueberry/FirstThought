import React, { createContext, useCallback, useContext, useRef } from 'react';
import type { RefObject } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import type { FlatList } from 'react-native-gesture-handler';

export type StickyKey = string;

export type StickyAPI = {
  registerItemRef: (key: StickyKey, ref: React.RefObject<View>) => void;
  onItemPress: (key: StickyKey) => Promise<void>;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export const StickySelectionPositionContext = createContext<StickyAPI | null>(null);
export function useStickySelectionPositionContext() {
  return useContext(StickySelectionPositionContext);
}

export function useStickySelectionPosition(args: {
  scrollRef: RefObject<FlatList<any> | ScrollView>;
  overlay: { showOpaque: () => Promise<void>; hide: () => Promise<void> };
  applySelectedChange: () => Promise<void>;
}): StickyAPI {
  const itemRefs = useRef(new Map<StickyKey, RefObject<View>>());
  const lastPressedKey = useRef<StickyKey | null>(null);
  const savedY = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const isRunning = useRef(false);

  const registerItemRef = useCallback((key: StickyKey, ref: RefObject<View>) => {
    itemRefs.current.set(key, ref);
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    lastScrollY.current = e.nativeEvent.contentOffset.y;
  }, []);

  const measureCenterY = useCallback(
    (ref: RefObject<View>): Promise<number | null> =>
      new Promise((resolve) => {
        const node = ref.current;
        if (!node) {
          resolve(null);
          return;
        }
        node.measureInWindow((_x, y, _w, h) => {
          if (h === 0) {
            resolve(null);
          } else {
            resolve(y + h / 2);
          }
        });
      }),
    [],
  );

  const waitForLayout = useCallback(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
    [],
  );

  const onItemPress = useCallback(
    async (key: StickyKey) => {
      if (isRunning.current) return;
      const ref = itemRefs.current.get(key);
      if (!ref) return;
      isRunning.current = true;
      lastPressedKey.current = key;
      savedY.current = await measureCenterY(ref);
      try {
        await args.overlay.showOpaque();
        await args.applySelectedChange();
        await waitForLayout();
        const ref2 = itemRefs.current.get(key);
        if (ref2) {
          const newCenter = await measureCenterY(ref2);
          if (
            newCenter != null &&
            savedY.current != null &&
            Math.abs(newCenter - savedY.current) > 1
          ) {
            const delta = newCenter - savedY.current;
            const scroll = args.scrollRef.current as any;
            if (scroll && typeof scroll.scrollToOffset === 'function') {
              scroll.scrollToOffset({
                offset: lastScrollY.current + delta,
                animated: false,
              });
            } else if (scroll && typeof scroll.scrollTo === 'function') {
              scroll.scrollTo({ y: lastScrollY.current + delta, animated: false });
            }
          }
        }
      } finally {
        await args.overlay.hide();
        isRunning.current = false;
      }
    },
    [args.overlay, args.applySelectedChange, args.scrollRef, measureCenterY, waitForLayout],
  );

  return { registerItemRef, onItemPress, onScroll };
}
