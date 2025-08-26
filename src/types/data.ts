export interface Diary {
  id: string;
  icon: string;
  title: string;
}

export interface DiaryMeta {
  id: string;
  title: string;
  createdAt: number;
}

export type EntryData = Record<string, unknown>;

export function isDiaryMeta(value: unknown): value is DiaryMeta {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    typeof (value as { id?: unknown }).id === 'string' &&
    typeof (value as { title?: unknown }).title === 'string' &&
    typeof (value as { createdAt?: unknown }).createdAt === 'number'
  );
}

export function isEntryData(value: unknown): value is EntryData {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
