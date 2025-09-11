import { RefObject } from 'react';
import { ScrollView, View, findNodeHandle } from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: RefObject<View | null>,
  opts: { timeoutMs?: number; settleRafs?: number } = {},
) {
  const ctx = getStickySelectionContext();
  if (!ctx) return;
  const { state } = ctx;
  const { lastId, yCenterOnScreen: savedCenter } = state;
  if (!lastId || savedCenter == null) return;

  const targetRef = getItemRef(lastId);
  const scrollView = scrollRef.current;
  const content = contentRef.current;
  if (!targetRef || !scrollView || !content) return;

  const scrollNode = findNodeHandle(scrollView);
  if (scrollNode == null) return;

  const { timeoutMs = 200, settleRafs = 4 } = opts;
  const start = Date.now();
  let prevTop = 0;
  let prevHeight = 0;
  let top = 0;
  let height = 0;
  let scrollViewTopWin = 0;
  let stableFrames = 0;

  while (Date.now() - start < timeoutMs) {
    const ok = await new Promise<boolean>((resolve) => {
      let done = 0;
      let failed = false;
      const maybeResolve = () => {
        done += 1;
        if (done === 2) resolve(!failed);
      };
      targetRef.measureLayout(
        scrollNode,
        (_l: number, t: number, _w: number, h: number) => {
          top = t;
          height = h;
          maybeResolve();
        },
        () => {
          failed = true;
          maybeResolve();
        },
      );
      (scrollView as any).measureInWindow((_: number, y: number) => {
        scrollViewTopWin = y;
        maybeResolve();
      });
    });
    if (!ok) return;
    if (
      Math.abs(top - prevTop) < 0.5 &&
      Math.abs(height - prevHeight) < 0.5
    ) {
      stableFrames += 1;
      if (stableFrames >= 2) break;
    } else {
      stableFrames = 0;
    }
    prevTop = top;
    prevHeight = height;
    await raf();
  }

  for (let i = 0; i < settleRafs; i += 1) {
    await raf();
  }

  const savedCenterViewport = savedCenter - scrollViewTopWin;
  const currentCenterViewport = top + height / 2;

  let contentTopViewport = 0;
  const layoutOk = await new Promise<boolean>((resolve) => {
    content.measureLayout(
      scrollNode,
      (_lx: number, t: number) => {
        contentTopViewport = t;
        resolve(true);
      },
      () => resolve(false),
    );
  });
  if (!layoutOk) return;

  let contentHeight = 0;
  let viewportHeight = 0;

  await new Promise<void>((resolve) => {
    (content as any).measure((_: number, __: number, ___: number, h: number) => {
      contentHeight = h;
      resolve();
    });
  });

  await new Promise<void>((resolve) => {
    (scrollView as any).measure((_: number, __: number, ___: number, h: number) => {
      viewportHeight = h;
      resolve();
    });
  });

  if (contentHeight === 0 || viewportHeight === 0) return;

  const currentScrollY = -contentTopViewport;
  const deltaViewport = currentCenterViewport - savedCenterViewport;
  const maxScroll = Math.max(contentHeight - viewportHeight, 0);
  const targetY = clamp(currentScrollY + deltaViewport, 0, maxScroll);

  scrollView.scrollTo({ y: targetY, animated: false });
}

