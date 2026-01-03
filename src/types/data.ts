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
