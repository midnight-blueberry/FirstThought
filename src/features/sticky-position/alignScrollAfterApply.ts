import type { RefObject } from 'react';
import { ScrollView } from 'react-native';
import { OverlayTransitionContext } from '@components/settings/overlay/OverlayTransition';
import { StickySelectionContext, type StickySelectionContextValue } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
): Promise<void> {
  const ctx = (StickySelectionContext as any)
    ._currentValue as StickySelectionContextValue | null;
  if (!ctx) return;
  const { state, reset, scrollYRef, statusRef } = ctx;
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) return;
  const targetRef = getItemRef(lastId);
  if (!targetRef) {
    const overlay = (OverlayTransitionContext as any)._currentValue as any;
    await overlay?.end?.();
    reset();
    statusRef.current = 'idle';
    return;
  }
  await raf();
  await raf();
  let y = 0;
  let h = 0;
  for (let i = 0; i < 3; i++) {
    await new Promise<void>((resolve) => {
      targetRef.measureInWindow((_x: number, ty: number, _w: number, th: number) => {
        y = ty;
        h = th;
        resolve();
      });
    });
    if (y !== 0 || h !== 0) {
      break;
    }
    await raf();
  }
  const newCenter = y + h / 2;
  const delta = newCenter - yCenterOnScreen;
  statusRef.current = 'scrolling';
  if (Math.abs(delta) >= 1 && scrollRef.current) {
    const currentY = scrollYRef.current;
    scrollRef.current.scrollTo({ y: currentY + delta, animated: false });
    scrollYRef.current = currentY + delta;
  }
  await raf();
  const overlay = (OverlayTransitionContext as any)._currentValue as any;
  await overlay?.end?.();
  reset();
  statusRef.current = 'idle';
}
