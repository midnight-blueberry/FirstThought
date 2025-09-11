import type { RefObject } from 'react';
import type { ScrollView } from 'react-native';
import { getItemRef } from './registry';
import { useStickySelectionContext } from './StickySelectionProvider';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
): Promise<void> {
  const { state, reset, statusRef, scrollYRef } = useStickySelectionContext();
  const overlay = useOverlayTransition();
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) {
    await overlay.end();
    reset();
    statusRef.current = 'idle';
    return;
  }
  const targetRef = getItemRef(lastId);
  if (!targetRef) {
    await overlay.end();
    reset();
    statusRef.current = 'idle';
    return;
  }
  await raf();
  await raf();
  let measured = false;
  let retries = 0;
  let newCenter = 0;
  while (!measured && retries < 3) {
    await new Promise<void>((resolve) => {
      targetRef.measureInWindow((_x, y, _w, h) => {
        if (y === 0 && h === 0) {
          resolve();
          return;
        }
        newCenter = y + h / 2;
        measured = true;
        resolve();
      });
    });
    if (!measured) {
      retries += 1;
      await raf();
    }
  }
  const delta = newCenter - yCenterOnScreen;
  const scrollView = scrollRef.current;
  if (scrollView && Math.abs(delta) >= 1) {
    statusRef.current = 'scrolling';
    const currentY = scrollYRef.current;
    scrollView.scrollTo({ y: currentY + delta, animated: false });
    scrollYRef.current = currentY + delta;
  }
  await raf();
  statusRef.current = 'applying';
  await overlay.end();
  reset();
  statusRef.current = 'idle';
}
