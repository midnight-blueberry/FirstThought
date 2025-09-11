import React, { useEffect, useRef } from 'react';
import type { View } from 'react-native';

const registry = new Map<string, WeakRef<View>>();

export type ViewRef = React.RefObject<View | null>;

export const registerItem = (id: string, ref: ViewRef): void => {
  const node = ref.current;
  if (node) {
    registry.set(id, new WeakRef(node));
  }
};

export const getItemRef = (id: string): View | null => {
  const ref = registry.get(id);
  const node = ref?.deref() ?? null;
  if (node == null) {
    registry.delete(id);
  }
  return node;
};

export function useStickyRegister(id: string): React.RefObject<View | null> {
  const ref = useRef<View | null>(null);
  useEffect(() => {
    registerItem(id, ref);
  });
  return ref;
}
