const registry = new Map<string, number>();

export function registerItemHandle(id: string, handle: number | null): void {
  if (handle == null) {
    registry.delete(id);
  } else {
    registry.set(id, handle);
  }
}

export function getItemHandle(id: string): number | null {
  return registry.get(id) ?? null;
}
