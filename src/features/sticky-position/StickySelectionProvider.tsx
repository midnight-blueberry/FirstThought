import React, { createContext, useCallback, useMemo, useRef } from 'react';
import type { View, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';
import { alignScrollAfterApply } from './alignScrollAfterApply';
import type { StickySelection } from './stickyTypes';

export type StickyStatus = 'idle' | 'measuring' | 'applying' | 'scrolling';

export interface StickySelectionContextValue {
  state: StickySelection;
  status: React.MutableRefObject<StickyStatus>;
  registerPress: (id: string, ref: React.RefObject<View | null>) => Promise<void>;
  applyWithSticky: (applyFn: () => Promise<void> | void) => Promise<void>;
  reset: () => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef: React.RefObject<ScrollView>;
  overlay: ReturnType<typeof useOverlayTransition>;
}

const StickySelectionContext = createContext<StickySelectionContextValue | null>(null);

let latestContext: StickySelectionContextValue | null = null;

export const getStickySelectionContext = () => latestContext;

export const StickySelectionProvider: React.FC<{
  children: React.ReactNode;
  scrollRef: React.RefObject<ScrollView>;
}> = ({ children, scrollRef }) => {
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
            if (__DEV__) {
              console.log('StickySelection', stateRef.current);
            }
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

  const value = useMemo(
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

  latestContext = value;

  return (
    <StickySelectionContext.Provider value={value}>
      {children}
    </StickySelectionContext.Provider>
  );
};

export function useStickySelectionContext() {
  const ctx = React.useContext(StickySelectionContext);
  if (!ctx) {
    throw new Error('useStickySelectionContext must be used within StickySelectionProvider');
  }
  return ctx;
}

export { StickySelectionContext };

