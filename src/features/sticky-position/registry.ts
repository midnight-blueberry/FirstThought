import { useEffect, useRef, type RefObject } from 'react';
import type { View } from 'react-native';

export type ViewRef = RefObject<View | null>;

const registry = new Map<string, WeakRef<View>>();

export function registerItem(id: string, ref: ViewRef): void {
  if (ref.current) {
    registry.set(id, new WeakRef(ref.current));
  }
}

export function getItemRef(id: string): View | null {
  const wr = registry.get(id);
  const view = wr?.deref() ?? null;
  if (!view) {
    registry.delete(id);
  }
  return view;
}

export function useStickyRegister(id: string): RefObject<View | null> {
  const ref = useRef<View | null>(null);
  useEffect(() => {
    registerItem(id, ref);
  }, [id]);
  return ref;
}
