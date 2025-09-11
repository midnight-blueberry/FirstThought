import { useEffect, useRef, type RefObject } from 'react';
import type { View } from 'react-native';

type ViewRef = RefObject<View | null>;

const registry = new Map<string, WeakRef<View>>();

export function registerItem(id: string, ref: ViewRef): void {
  const node = ref.current;
  if (node) {
    registry.set(id, new WeakRef(node));
  }
}

export function getItemRef(id: string): View | null {
  return registry.get(id)?.deref() ?? null;
}

export function useStickyRegister(id: string): RefObject<View | null> {
  const ref = useRef<View | null>(null);
  useEffect(() => {
    registerItem(id, ref);
  }, [id]);
  return ref;
}
