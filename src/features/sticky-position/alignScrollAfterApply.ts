import { RefObject, MutableRefObject } from 'react';
import { ScrollView, View, findNodeHandle } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: MutableRefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state } = ctx;
  const { lastId, yCenterOnScreen: savedCenter } = state;
  if (!lastId || savedCenter == null) {
    return;
  }
  const targetRef = getItemRef(lastId);
  const scrollView = scrollRef.current;
  const content = contentRef.current;
  if (!targetRef || !scrollView || !content) {
    return;
  }

  const scrollNode = findNodeHandle(scrollView);
  if (!scrollNode) {
    return;
  }

  const { timeoutMs = 200, settleRafs = 4 } = opts;
  const start = Date.now();
  let prevTop = -Infinity;
  let prevHeight = -Infinity;
  let stable = 0;
  let top = 0;
  let height = 0;
  let scrollViewTopWin = 0;
  let iterations = 0;

  while (iterations < settleRafs && Date.now() - start < timeoutMs) {
    await new Promise<void>((resolve) => {
      (targetRef as any).measureLayout(scrollNode, (_l: number, t: number, _w: number, h: number) => {
        top = t;
        height = h;
        resolve();
      });
    });
    await new Promise<void>((resolve) => {
      (scrollView as any).measureInWindow((_x: number, y: number) => {
        scrollViewTopWin = y;
        resolve();
      });
    });
    const dy = Math.abs(top - prevTop);
    const dh = Math.abs(height - prevHeight);
    if (dy < 0.5 && dh < 0.5) {
      stable += 1;
      if (stable >= 2) break;
    } else {
      stable = 0;
    }
    prevTop = top;
    prevHeight = height;
    iterations += 1;
    await raf();
  }

  if (stable < 2) {
    // measurements didn't stabilize
    return;
  }

  const savedCenterViewport = savedCenter - scrollViewTopWin;
  const currentCenterViewport = top + height / 2;

  let contentTopViewport = 0;
  await new Promise<void>((resolve) => {
    (content as any).measureLayout(scrollNode, (_l: number, t: number) => {
      contentTopViewport = t;
      resolve();
    });
  });

  let currentScrollY = -contentTopViewport;

  let contentHeight = 0;
  await new Promise<void>((resolve) => {
    (content as any).measure((_x: number, _y: number, _w: number, h: number) => {
      contentHeight = h;
      resolve();
    });
  });

  let viewportHeight = 0;
  await new Promise<void>((resolve) => {
    (scrollView as any).measure((_x: number, _y: number, _w: number, h: number) => {
      viewportHeight = h;
      resolve();
    });
  });

  if (contentHeight === 0 || viewportHeight === 0) {
    return;
  }

  const deltaViewport = currentCenterViewport - savedCenterViewport;
  const targetY = clamp(
    currentScrollY + deltaViewport,
    0,
    contentHeight - viewportHeight,
  );

  scrollView.scrollTo({ y: targetY, animated: false });
}
