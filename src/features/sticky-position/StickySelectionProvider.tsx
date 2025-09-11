import React, { createContext, useMemo, useRef, useCallback } from 'react';
import type { RefObject } from 'react';
import { View } from 'react-native';

interface StickySelectionState {
  lastId: string | null;
  yCenterOnScreen: number | null;
  ts: number | null;
}

interface StickySelectionContextValue {
  state: StickySelectionState;
  registerPress: (id: string, ref: RefObject<View | null>) => Promise<void>;
  reset: () => void;
}

export const StickySelectionContext =
  createContext<StickySelectionContextValue | null>(null);

export const StickySelectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const stateRef = useRef<StickySelectionState>({
    lastId: null,
    yCenterOnScreen: null,
    ts: null,
  });

  const registerPress = useCallback(
    (id: string, ref: RefObject<View | null>): Promise<void> => {
      return new Promise((resolve) => {
        const tryMeasure = (attempt: number) => {
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
          if (attempt < 2) {
            requestAnimationFrame(() => tryMeasure(attempt + 1));
          } else {
            stateRef.current.lastId = id;
            stateRef.current.yCenterOnScreen = null;
            stateRef.current.ts = Date.now();
            if (__DEV__) {
              console.warn('StickySelection: failed to measure', id);
              console.log('StickySelection', stateRef.current);
            }
            resolve();
          }
        };
        tryMeasure(0);
      });
    },
    [],
  );

  const reset = useCallback(() => {
    stateRef.current.lastId = null;
    stateRef.current.yCenterOnScreen = null;
    stateRef.current.ts = null;
  }, []);

  const contextValue = useMemo(
    () => ({ state: stateRef.current, registerPress, reset }),
    [registerPress, reset],
  );

  return (
    <StickySelectionContext.Provider value={contextValue}>
      {children}
    </StickySelectionContext.Provider>
  );
};

export default StickySelectionProvider;

