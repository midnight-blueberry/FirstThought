const registry = new Map<string, number | null>();

export function registerItemHandle(id: string, handle: number | null): void {
  registry.set(id, handle);
}

export function getItemHandle(id: string): number | null {
  return registry.get(id) ?? null;
}

