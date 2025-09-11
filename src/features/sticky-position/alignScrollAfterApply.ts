import { RefObject } from 'react';
import { ScrollView, findNodeHandle } from 'react-native';
import type { View } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: RefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state, scrollYRef } = ctx;
  const { lastId, yCenterOnScreen } = state;
  if (!lastId || yCenterOnScreen == null) {
    return;
  }

  const targetRef = getItemRef(lastId);
  const scrollView = scrollRef.current;
  const contentView = contentRef.current;
  if (!targetRef || !scrollView || !contentView) {
    return;
  }

  const scrollHandle = findNodeHandle(scrollView);
  if (scrollHandle == null) return;

  const { timeoutMs = 200, settleRafs = 4 } = opts;

  let top = 0;
  let height = 0;
  let scrollViewTopWin = 0;
  let viewportHeight = 0;

  const measure = () =>
    new Promise<boolean>((resolve) => {
      targetRef.measureLayout(
        scrollHandle,
        (_x: number, t: number, _w: number, h: number) => {
          (scrollView as any).measureInWindow(
            (_x1: number, y: number, _w1: number, h1: number) => {
              top = t;
              height = h;
              scrollViewTopWin = y;
              viewportHeight = h1;
              resolve(true);
            },
          );
        },
        () => resolve(false),
      );
    });

  const start = Date.now();
  let prevTop = Infinity;
  let prevHeight = Infinity;
  let stableCount = 0;
  let rafs = 0;

  while (stableCount < 2 && Date.now() - start < timeoutMs && rafs < settleRafs) {
    await raf();
    const ok = await measure();
    if (!ok) return;
    if (Math.abs(top - prevTop) < 0.5 && Math.abs(height - prevHeight) < 0.5) {
      stableCount += 1;
    } else {
      stableCount = 0;
    }
    prevTop = top;
    prevHeight = height;
    rafs += 1;
  }

  const savedCenterViewport = yCenterOnScreen - scrollViewTopWin;
  const currentCenterViewport = top + height / 2;

  let contentTopViewport = 0;
  let contentHeight = 0;

  const measuredContent = await new Promise<boolean>((resolve) => {
    contentView.measureLayout(
      scrollHandle,
      (_x: number, t: number, _w: number, h: number) => {
        contentTopViewport = t;
        contentHeight = h;
        resolve(true);
      },
      () => resolve(false),
    );
  });

  if (!measuredContent) return;

  const currentScrollY = -contentTopViewport;

  const deltaViewport = currentCenterViewport - savedCenterViewport;
  const targetY = clamp(
    currentScrollY + deltaViewport,
    0,
    Math.max(0, contentHeight - viewportHeight),
  );

  scrollView.scrollTo({ y: targetY, animated: false });
  scrollYRef.current = targetY;
}

