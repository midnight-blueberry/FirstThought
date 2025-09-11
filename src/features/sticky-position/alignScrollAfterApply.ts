import { RefObject } from 'react';
import { ScrollView, View } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemHandle } from './registry';
import { measureInWindowByHandle, measureViewportOfScrollView } from './nativeMeasure';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: RefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen: savedCenterOnScreen } = state;
  if (!lastId || savedCenterOnScreen == null) {
    return;
  }
  const handle = getItemHandle(lastId);
  if (handle == null || !scrollRef.current) {
    return;
  }

  const timeoutMs = opts.timeoutMs ?? 200;
  const settleRafs = opts.settleRafs ?? 4;
  const start = Date.now();

  let box = await measureInWindowByHandle(handle);
  let prev = box;
  for (let i = 0; i < settleRafs; i++) {
    if (Date.now() - start > timeoutMs) break;
    await raf();
    box = await measureInWindowByHandle(handle);
    if (Math.abs(box.y - prev.y) < 0.5 && Math.abs(box.height - prev.height) < 0.5) {
      break;
    }
    prev = box;
  }

  const { topWin: scrollTopWin, height: viewportH } = await measureViewportOfScrollView(
    scrollRef.current,
  );

  const savedCenterViewport = savedCenterOnScreen - scrollTopWin;
  const currentCenterViewport = box.y + box.height / 2 - scrollTopWin;
  const deltaViewport = currentCenterViewport - savedCenterViewport;

  let contentH = Number.POSITIVE_INFINITY;
  await new Promise<void>((resolve) => {
    const node = contentRef.current as any;
    if (node && typeof node.measure === 'function') {
      node.measure(
        (_x: number, _y: number, _w: number, h: number) => {
          contentH = h;
          resolve();
        },
      );
    } else {
      resolve();
    }
  });

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const targetY = clamp(
    scrollYRef.current + deltaViewport,
    0,
    Math.max(0, contentH - viewportH),
  );
  scrollRef.current.scrollTo({ y: targetY, animated: false });
  scrollYRef.current = targetY;
}
