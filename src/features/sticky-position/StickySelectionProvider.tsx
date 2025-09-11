import React, { createContext, useCallback, useMemo, useRef } from 'react';
import type { View } from 'react-native';
import { ScrollView } from 'react-native';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';
import { alignScrollAfterApply } from './alignScrollAfterApply';
import { getItemHandle } from './registry';
import { measureInWindowByHandle } from './nativeMeasure';

export interface StickySelectionState {
  lastId: string | null;
  yCenterOnScreen: number | null;
  ts: number | null;
}

export type StickyStatus = 'idle' | 'measuring' | 'applying' | 'scrolling';

export interface StickySelectionContextValue {
  state: StickySelectionState;
  status: React.MutableRefObject<StickyStatus>;
  registerPress: (id: string) => Promise<void>;
  applyWithSticky: (
    applyFn: () => Promise<void> | void,
    scrollRef: React.RefObject<ScrollView>,
    contentRef: React.RefObject<View | null>,
  ) => Promise<void>;
  reset: () => void;
  scrollYRef: React.MutableRefObject<number>;
  overlay: ReturnType<typeof useOverlayTransition>;
}

const StickySelectionContext = createContext<StickySelectionContextValue | null>(null);

let latestContext: StickySelectionContextValue | null = null;

export const getStickySelectionContext = () => latestContext;

export const StickySelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stateRef = useRef<StickySelectionState>({
    lastId: null,
    yCenterOnScreen: null,
    ts: null,
  });
  const statusRef = useRef<StickyStatus>('idle');
  const scrollYRef = useRef(0);
  const overlay = useOverlayTransition();

  const currentAnim = useRef<{ id: number } | null>(null);
  const animCounter = useRef(0);

  const fadeOverlayTo = useCallback(
    async (target: 0 | 1, duration = 300) => {
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

  const registerPress = useCallback(async (id: string) => {
    statusRef.current = 'measuring';
    let attempts = 0;
    let handle = getItemHandle(id);
    while (!handle && attempts < 3) {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      handle = getItemHandle(id);
      attempts += 1;
    }
    if (!handle) {
      if (__DEV__) {
        console.warn('StickySelection: handle not found for', id);
      }
      statusRef.current = 'idle';
      return;
    }
    const { y, height } = await measureInWindowByHandle(handle);
    stateRef.current.lastId = id;
    stateRef.current.yCenterOnScreen = y + height / 2;
    stateRef.current.ts = Date.now();
    if (__DEV__) {
      console.log('StickySelection', stateRef.current);
    }
    statusRef.current = 'idle';
  }, []);

  const reset = useCallback(() => {
    stateRef.current.lastId = null;
    stateRef.current.yCenterOnScreen = null;
    stateRef.current.ts = null;
    statusRef.current = 'idle';
  }, []);

  const applyWithSticky = useCallback(
    async (
      applyFn: () => Promise<void> | void,
      scrollRef: React.RefObject<ScrollView>,
      contentRef: React.RefObject<View | null>,
    ) => {
      if (statusRef.current === 'scrolling') return;
      if (
        stateRef.current.lastId == null ||
        stateRef.current.yCenterOnScreen == null
      ) {
        return;
      }
      await fadeOverlayTo(1);
      statusRef.current = 'applying';
      try {
        await applyFn();
        statusRef.current = 'scrolling';
        await alignScrollAfterApply(scrollRef, contentRef);
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
    [fadeOverlayTo, reset],
  );

  const value = useMemo(
    () => ({
      state: stateRef.current,
      status: statusRef,
      registerPress,
      applyWithSticky,
      reset,
      scrollYRef,
      overlay,
    }),
    [registerPress, applyWithSticky, reset, overlay],
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

