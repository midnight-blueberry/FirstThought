import type { RefObject } from 'react';
import { ScrollView } from 'react-native';
import { useStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
): Promise<void> {
  const { state, reset, scrollYRef } = useStickySelectionContext();
  const overlay = useOverlayTransition();
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) {
    await overlay.end();
    return;
  }
  const targetRef = getItemRef(lastId);
  if (!targetRef) {
    state.status = 'idle';
    reset();
    await overlay.end();
    return;
  }

  await raf();
  await raf();

  let y = 0;
  let h = 0;
  for (let i = 0; i < 3; i += 1) {
    await new Promise<void>((resolve) => {
      (targetRef as any).measureInWindow((_x: number, yy: number, _w: number, hh: number) => {
        y = yy;
        h = hh;
        resolve();
      });
    });
    if (y !== 0 || h !== 0) break;
    await raf();
  }

  const newCenter = y + h / 2;
  const delta = newCenter - yCenterOnScreen;
  const sv = scrollRef.current;
  if (sv && Math.abs(delta) >= 1) {
    state.status = 'scrolling';
    const nextY = scrollYRef.current + delta;
    sv.scrollTo({ y: nextY, animated: false });
    scrollYRef.current = nextY;
  }

  await raf();
  state.status = 'applying';
  await overlay.end();
  reset();
  state.status = 'idle';
}
