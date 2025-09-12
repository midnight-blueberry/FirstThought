import { InteractionManager } from 'react-native';
import { getRef } from './registry';
import type { AlignScrollAfterApplyParams } from './stickyTypes';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export function computeDelta(prevCenterY: number, pageY: number, height: number): number {
  return pageY + height / 2 - prevCenterY;
}

export async function alignScrollAfterApply({ id, prevCenterY }: AlignScrollAfterApplyParams): Promise<number> {
  await InteractionManager.runAfterInteractions();
  await raf();
  await raf();
  const ref = getRef(id)?.current;
  if (!ref || typeof ref.measureInWindow !== 'function') {
    return 0;
  }
  const { y, h } = await new Promise<{ y: number; h: number }>((resolve) => {
    ref.measureInWindow((_x, y0, _w, h0) => resolve({ y: y0, h: h0 }));
  });
  return computeDelta(prevCenterY, y, h);
}
