import { RefObject } from 'react';
import { ScrollView } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function alignScrollAfterApply(scrollRef: RefObject<ScrollView>) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, reset, status, overlay, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) {
    await overlay.end();
    status.current = 'idle';
    reset();
    return;
  }
  const targetRef = getItemRef(lastId);
  if (!targetRef) {
    await overlay.end();
    status.current = 'idle';
    reset();
    return;
  }
  if (!scrollRef.current) {
    await overlay.end();
    status.current = 'idle';
    reset();
    return;
  }
  status.current = 'scrolling';
  await raf();
  await raf();
  let attempts = 0;
  let y = 0;
  let h = 0;
  while (attempts < 3) {
    await new Promise<void>((resolve) => {
      targetRef.measureInWindow((_x, y0, _w, h0) => {
        y = y0;
        h = h0;
        resolve();
      });
    });
    if (y !== 0 || h !== 0) break;
    attempts += 1;
    await raf();
  }
  const newCenter = y + h / 2;
  const delta = newCenter - yCenterOnScreen;
  if (Math.abs(delta) >= 1) {
    const currentY = scrollYRef.current;
    scrollRef.current.scrollTo({ y: currentY + delta, animated: false });
    scrollYRef.current = currentY + delta;
  }
  await raf();
  await overlay.end();
  reset();
  status.current = 'idle';
}
