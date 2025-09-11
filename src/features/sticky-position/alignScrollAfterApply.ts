import { RefObject } from 'react';
import { ScrollView, type View } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemHandle } from './registry';
import {
  measureInWindowByHandle,
  measureViewportOfScrollView,
} from './nativeMeasure';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

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
  if (!handle || !scrollRef.current) {
    return;
  }

  const start = Date.now();
  const timeoutMs = opts.timeoutMs ?? 200;
  const settleRafs = opts.settleRafs ?? 4;

  let box = await measureInWindowByHandle(handle);
  let prev = box;
  for (let i = 0; i < settleRafs; i++) {
    if (Date.now() - start > timeoutMs) {
      break;
    }
    await raf();
    box = await measureInWindowByHandle(handle);
    const dy = Math.abs(box.y - prev.y);
    const dh = Math.abs(box.height - prev.height);
    if (dy < 0.5 && dh < 0.5) {
      break;
    }
    prev = box;
  }

  const { topWin: scrollTopWin, height: viewportH } =
    await measureViewportOfScrollView(scrollRef.current);

  const savedCenterViewport = savedCenterOnScreen - scrollTopWin;
  const currentCenterViewport = box.y + box.height / 2 - scrollTopWin;
  const deltaViewport = currentCenterViewport - savedCenterViewport;

  let contentH = Number.POSITIVE_INFINITY;
  if (contentRef.current) {
    contentH = await new Promise<number>((resolve) => {
      contentRef.current!.measure((_x, _y, _w, h) => resolve(h));
    });
  }

  const targetY = clamp(
    scrollYRef.current + deltaViewport,
    0,
    Math.max(0, contentH - viewportH),
  );
  scrollRef.current.scrollTo({ y: targetY, animated: false });
  scrollYRef.current = targetY;
}

