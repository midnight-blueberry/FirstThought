import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type { View } from 'react-native';

const registry = new Map<string, WeakRef<View>>();

export function registerItem(id: string, ref: RefObject<View | null>): void {
  const node = ref.current;
  if (node) {
    registry.set(id, new WeakRef(node));
  } else {
    registry.delete(id);
  }
}

export function getItemRef(id: string): View | null {
  const item = registry.get(id);
  const target = item?.deref?.() ?? null;
  if (!target) {
    registry.delete(id);
  }
  return target;
}

export function useStickyRegister(id: string): RefObject<View | null> {
  const ref = useRef<View | null>(null);
  useEffect(() => {
    registerItem(id, ref);
    return () => {
      registry.delete(id);
    };
  }, [id]);
  return ref;
}
