import { RefObject } from 'react';
import { ScrollView, View } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemHandle } from './registry';
import {
  measureInWindowByHandle,
  measureViewportOfScrollView,
} from './nativeMeasure';

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: React.MutableRefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen: savedCenterOnScreen } = state;
  if (!lastId || savedCenterOnScreen == null) return;
  if (!scrollRef.current) return;

  const handle = getItemHandle(lastId);
  if (handle == null) return;

  const timeoutMs = opts.timeoutMs ?? 200;
  const settleRafs = opts.settleRafs ?? 4;
  const start = Date.now();

  let box = await measureInWindowByHandle(handle);
  let prevY = box.y;
  let prevH = box.height;
  for (let i = 0; i < settleRafs; i += 1) {
    await raf();
    box = await measureInWindowByHandle(handle);
    const dy = Math.abs(box.y - prevY);
    const dh = Math.abs(box.height - prevH);
    if (dy < 0.5 && dh < 0.5) break;
    prevY = box.y;
    prevH = box.height;
    if (Date.now() - start > timeoutMs) break;
  }

  const { topWin: scrollTopWin, height: viewportH } =
    await measureViewportOfScrollView(scrollRef.current);

  const savedCenterViewport = savedCenterOnScreen - scrollTopWin;
  const currentCenterViewport = box.y + box.height / 2 - scrollTopWin;
  const deltaViewport = currentCenterViewport - savedCenterViewport;

  let contentH = Number.POSITIVE_INFINITY;
  await new Promise<void>((resolve) => {
    contentRef.current?.measure?.((_x, _y, _w, h) => {
      contentH = h;
      resolve();
    });
    if (!contentRef.current?.measure) resolve();
  });

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));
  const targetY = clamp(
    scrollYRef.current + deltaViewport,
    0,
    Math.max(0, contentH - viewportH),
  );

  scrollRef.current.scrollTo({ y: targetY, animated: false });
  scrollYRef.current = targetY;
}
