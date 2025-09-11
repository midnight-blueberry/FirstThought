import { RefObject } from 'react';
import { ScrollView, View } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemHandle } from './registry';
import {
  measureInWindowByHandle,
  measureViewportOfScrollView,
} from './nativeMeasure';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: RefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen: savedCenterOnScreen } = state;
  if (!lastId || savedCenterOnScreen == null || !scrollRef.current) {
    return;
  }
  let handle = getItemHandle(lastId);
  if (!handle) {
    return;
  }

  const start = Date.now();
  const timeoutMs = opts.timeoutMs ?? 200;
  const settleRafs = opts.settleRafs ?? 4;
  let prevBox: { y: number; height: number } | null = null;
  let box: { y: number; height: number } = { y: 0, height: 0 };
  let i = 0;
  while (i < settleRafs && Date.now() - start < timeoutMs) {
    box = await measureInWindowByHandle(handle);
    if (
      prevBox &&
      Math.abs(box.y - prevBox.y) < 0.5 &&
      Math.abs(box.height - prevBox.height) < 0.5
    ) {
      break;
    }
    prevBox = box;
    i += 1;
    await raf();
  }

  const { topWin: scrollTopWin, height: viewportH } =
    await measureViewportOfScrollView(scrollRef.current);
  const savedCenterViewport = savedCenterOnScreen - scrollTopWin;
  const currentCenterViewport = box.y + box.height / 2 - scrollTopWin;
  const deltaViewport = currentCenterViewport - savedCenterViewport;

  let contentH = Number.POSITIVE_INFINITY;
  await new Promise<void>((resolve) => {
    const node = contentRef.current as View | null;
    node?.measure?.((_x, _y, _w, h) => {
      contentH = h;
      resolve();
    }) ?? resolve();
  });

  const targetY = clamp(
    scrollYRef.current + deltaViewport,
    0,
    Math.max(0, contentH - viewportH),
  );
  scrollRef.current.scrollTo({ y: targetY, animated: false });
  scrollYRef.current = targetY;
}
