import React, { createContext, useContext } from 'react';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import type { useOverlayTransition } from '@/components/settings/overlay';
import type { StickySelection } from './stickyTypes';

export type StickyStatus = 'idle' | 'measuring' | 'applying' | 'scrolling';

export interface StickySelectionContextValue {
  state: StickySelection;
  status: React.MutableRefObject<StickyStatus>;
  registerPress: (
    id: string,
    ref: React.RefObject<View | null>,
  ) => Promise<void>;
  applyWithSticky: (applyFn: () => Promise<void> | void) => Promise<void>;
  reset: () => void;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollRef: React.RefObject<ScrollView>;
  overlay: ReturnType<typeof useOverlayTransition>;
}

export const StickySelectionContext = createContext<StickySelectionContextValue | null>(
  null,
);

let latestContext: StickySelectionContextValue | null = null;
export const setStickySelectionContext = (
  ctx: StickySelectionContextValue | null,
): void => {
  latestContext = ctx;
};
export const getStickySelectionContext = () => latestContext;

export function useStickySelection(): StickySelectionContextValue {
  const ctx = useContext(StickySelectionContext);
  if (!ctx) {
    throw new Error('useStickySelection must be used within StickySelectionProvider');
  }
  return ctx;
}

