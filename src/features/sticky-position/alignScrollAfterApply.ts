import { RefObject } from 'react';
import { ScrollView } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  opts: { timeoutMs?: number; maxRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) {
    return;
  }
  const targetRef = getItemRef(lastId);
  if (!targetRef || !scrollRef.current) {
    return;
  }

  const doAlign = async (maxRafs: number) => {
    await raf();
    await raf();
    let attempts = 0;
    let y = 0;
    let h = 0;
    while (attempts < maxRafs) {
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
    if (y === 0 && h === 0) {
      return;
    }
    const newCenter = y + h / 2;
    const delta = newCenter - yCenterOnScreen;
    if (Math.abs(delta) >= 1) {
      const currentY = scrollYRef.current;
      scrollRef.current.scrollTo({ y: currentY + delta, animated: false });
      scrollYRef.current = currentY + delta;
    }
    await raf();
  };

  const { timeoutMs = 300, maxRafs = 3 } = opts;

  await Promise.race([doAlign(maxRafs), delay(timeoutMs)]);
}
