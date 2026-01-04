import { useCallback, useMemo, useRef } from 'react';
import type { View, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import { useOverlayTransition } from '@/components/settings/overlay';
import { alignScrollAfterApply } from './alignScrollAfterApply';
import type { StickySelection } from './stickyTypes';
import {
  type StickySelectionContextValue,
  type StickyStatus,
  setStickySelectionContext,
} from './StickySelectionContext';

export function useStickySelectionState(
  scrollRef: React.RefObject<ScrollView>,
): StickySelectionContextValue {
  const stateRef = useRef<StickySelection>({
    id: null,
    ref: null,
    prevCenterY: null,
    ts: null,
  });
  const statusRef = useRef<StickyStatus>('idle');
  const latestScrollYRef = useRef(0);
  const overlay = useOverlayTransition();

  const currentAnim = useRef<{ id: number } | null>(null);
  const animCounter = useRef(0);

  const fadeOverlayTo = useCallback(
    async (target: 0 | 1) => {
      const id = ++animCounter.current;
      currentAnim.current = { id };
      try {
        if (target === 1) {
          await overlay.begin();
        } else {
          await overlay.end();
        }
      } finally {
        if (currentAnim.current?.id !== id) {
          return;
        }
      }
    },
    [overlay],
  );

  const registerPress = useCallback(async (id: string, ref: React.RefObject<View | null>) => {
    statusRef.current = 'measuring';
    await new Promise<void>((resolve) => {
      let attempts = 0;
      const measure = () => {
        const node = ref.current as any;
        if (node && typeof node.measureInWindow === 'function') {
          node.measureInWindow((_x: number, y: number, _w: number, h: number) => {
            stateRef.current.id = id;
            stateRef.current.ref = node;
            stateRef.current.prevCenterY = y + h / 2;
            stateRef.current.ts = Date.now();
            statusRef.current = 'idle';
            resolve();
          });
          return;
        }
        if (attempts < 3) {
          attempts += 1;
          requestAnimationFrame(measure);
        } else {
          if (__DEV__) {
            console.warn('StickySelection: measure failed for', id);
          }
          statusRef.current = 'idle';
          resolve();
        }
      };
      measure();
    });
  }, []);

  const reset = useCallback(() => {
    stateRef.current.id = null;
    stateRef.current.ref = null;
    stateRef.current.prevCenterY = null;
    stateRef.current.ts = null;
    statusRef.current = 'idle';
  }, []);

  const applyWithSticky = useCallback(
    async (applyFn: () => Promise<void> | void) => {
      if (statusRef.current === 'scrolling') return;
      const { id, prevCenterY } = stateRef.current;
      if (id == null || prevCenterY == null) {
        return;
      }
      await fadeOverlayTo(1);
      statusRef.current = 'applying';
      try {
        await applyFn();
        statusRef.current = 'scrolling';
        const delta = await alignScrollAfterApply({ id, prevCenterY });
        if (Math.abs(delta) >= 1) {
          const currentY = latestScrollYRef.current;
          scrollRef.current?.scrollTo({ y: currentY + delta, animated: false });
          latestScrollYRef.current = currentY + delta;
        }
      } catch (e) {
        if (__DEV__) {
          console.warn('[sticky] applyWithSticky error', e);
        }
      } finally {
        await fadeOverlayTo(0);
        reset();
        statusRef.current = 'idle';
      }
    },
    [fadeOverlayTo, reset, scrollRef],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      latestScrollYRef.current = e.nativeEvent.contentOffset.y;
    },
    [],
  );

  const value = useMemo<StickySelectionContextValue>(
    () => ({
      state: stateRef.current,
      status: statusRef,
      registerPress,
      applyWithSticky,
      reset,
      onScroll,
      scrollRef,
      overlay,
    }),
    [registerPress, applyWithSticky, reset, onScroll, overlay, scrollRef],
  );

  setStickySelectionContext(value);

  return value;
}

