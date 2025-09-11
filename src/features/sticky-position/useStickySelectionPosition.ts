import React, { useCallback, useContext, useRef, createContext } from 'react';
import type { RefObject } from 'react';
import type {
  View,
  FlatList,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export type StickyKey = string;

export type StickyAPI = {
  registerItemRef: (key: StickyKey, ref: RefObject<View | null>) => void;
  onItemPress: (key: StickyKey) => Promise<void>;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
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
  const { scrollRef, overlay, applySelectedChange } = args;
  const refs = useRef(new Map<StickyKey, RefObject<View | null>>());
  const lastPressedKey = useRef<StickyKey | null>(null);
  const savedY = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const isRunning = useRef(false);

  const registerItemRef = useCallback(
    (key: StickyKey, ref: RefObject<View | null>) => {
    refs.current.set(key, ref);
  }, []);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    lastScrollY.current = e.nativeEvent.contentOffset.y;
  }, []);

  const measureCenter = (ref: RefObject<View | null>): Promise<number> =>
    new Promise((resolve) => {
      ref.current?.measureInWindow((_x, y, _w, h) => {
        resolve(y + h / 2);
      });
    });

  const onItemPress = useCallback(
    async (key: StickyKey) => {
      if (isRunning.current) {
        return;
      }
      isRunning.current = true;
      try {
        lastPressedKey.current = key;
        const ref = refs.current.get(key);
        if (ref?.current) {
          savedY.current = await measureCenter(ref);
        }
        await overlay.showOpaque();
        await applySelectedChange();
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);
        const targetKey = lastPressedKey.current;
        if (targetKey) {
          const targetRef = refs.current.get(targetKey);
          if (targetRef?.current && savedY.current != null) {
            const newCenterY = await measureCenter(targetRef);
            const delta = newCenterY - savedY.current;
            if (Math.abs(delta) > 1) {
              const view: any = scrollRef.current;
              if (view?.scrollToOffset) {
                view.scrollToOffset({
                  offset: lastScrollY.current + delta,
                  animated: false,
                });
              } else if (view?.scrollTo) {
                view.scrollTo({ y: lastScrollY.current + delta, animated: false });
              }
            }
          }
        }
        await overlay.hide();
      } finally {
        isRunning.current = false;
      }
    },
    [overlay, applySelectedChange, scrollRef],
  );

  return { registerItemRef, onItemPress, handleScroll };
}

