import type { MutableRefObject, RefObject } from 'react';
import type { ScrollView, View } from 'react-native';

export interface StickySelection {
  lastId: string | null;
  yCenterOnScreen: number | null;
  ts: number | null;
}

export type StickyTargetRef = Pick<View, 'measureInWindow'>;

export interface AlignScrollAfterApplyParams {
  scrollRef: RefObject<ScrollView>;
  targetRef: StickyTargetRef | null;
  yCenterOnScreen: number;
  scrollYRef: MutableRefObject<number>;
  timeoutMs?: number;
  maxRafs?: number;
}
