import React, { createContext, useCallback, useMemo, useRef } from 'react';
import type { View } from 'react-native';

export interface StickySelectionState {
  lastId: string | null;
  yCenterOnScreen: number | null;
  ts: number | null;
}

export interface StickySelectionContextValue {
  state: StickySelectionState;
  registerPress: (id: string, ref: React.RefObject<View | null>) => Promise<void>;
  reset: () => void;
}

const StickySelectionContext = createContext<StickySelectionContextValue | null>(null);

export const StickySelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stateRef = useRef<StickySelectionState>({
    lastId: null,
    yCenterOnScreen: null,
    ts: null,
  });

  const registerPress = useCallback(async (id: string, ref: React.RefObject<View | null>) => {
    await new Promise<void>((resolve) => {
      let attempts = 0;
      const measure = () => {
        const node = ref.current as any;
        if (node && typeof node.measureInWindow === 'function') {
          node.measureInWindow((_x: number, y: number, _w: number, h: number) => {
            stateRef.current.lastId = id;
            stateRef.current.yCenterOnScreen = y + h / 2;
            stateRef.current.ts = Date.now();
            if (__DEV__) {
              console.log('StickySelection', stateRef.current);
            }
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
          resolve();
        }
      };
      measure();
    });
  }, []);

  const reset = useCallback(() => {
    stateRef.current.lastId = null;
    stateRef.current.yCenterOnScreen = null;
    stateRef.current.ts = null;
  }, []);

  const value = useMemo(
    () => ({ state: stateRef.current, registerPress, reset }),
    [registerPress, reset],
  );

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

