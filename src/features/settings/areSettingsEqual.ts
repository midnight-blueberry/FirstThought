import type { Settings as AppSettings } from '@/state/SettingsContext';

export function areSettingsEqual(a: AppSettings, b: AppSettings): boolean {
  return (
    a.themeId === b.themeId &&
    a.accent === b.accent &&
    a.fontFamily === b.fontFamily &&
    a.fontWeight === b.fontWeight &&
    a.fontSizeLevel === b.fontSizeLevel &&
    a.noteTextAlign === b.noteTextAlign
  );
}

export type { AppSettings };
