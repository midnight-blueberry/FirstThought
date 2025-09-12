import type { View } from 'react-native';

export interface StickySelection {
  id: string | null;
  ref: View | null;
  prevCenterY: number | null;
  ts: number | null;
}

export interface AlignScrollAfterApplyParams {
  id: string;
  prevCenterY: number;
}
