const registry = new Map<string, number>();

export function registerItemHandle(id: string, handle: number | null): void {
  if (handle != null) {
    registry.set(id, handle);
  } else {
    registry.delete(id);
  }
}

export function getItemHandle(id: string): number | null {
  return registry.get(id) ?? null;
}
