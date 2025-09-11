import { useCallback } from 'react';
import { View, findNodeHandle } from 'react-native';
import { registerItemHandle } from './registry';

export function useStickyRegister(id: string) {
  return useCallback(
    (node: View | null) => {
      const handle = node ? findNodeHandle(node) : null;
      registerItemHandle(id, handle ?? null);
    },
    [id],
  );
}

export type StickyRef = (node: View | null) => void;
