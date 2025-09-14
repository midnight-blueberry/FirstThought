import type { RefObject } from 'react';
import type { View } from 'react-native';

const registry = new Map<string, RefObject<View | null>>();

export function register(id: string, ref: RefObject<View | null>): void {
  registry.set(id, ref);
}

export function unregister(id: string): void {
  registry.delete(id);
}

export function getRef(id: string): RefObject<View | null> | undefined {
  return registry.get(id);
}

export function clearRegistry(): void {
  registry.clear();
}
