import { RefObject } from 'react';
import {
  ScrollView,
  View,
  findNodeHandle,
} from 'react-native';
import { getStickySelectionContext } from './StickySelectionProvider';
import { getItemRef } from './registry';

const raf = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export async function alignScrollAfterApply(
  scrollRef: RefObject<ScrollView>,
  contentRef: RefObject<View>,
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

  const { timeoutMs = 200, settleRafs = 4 } = opts;

  const scrollNode = findNodeHandle(scrollView);
  if (!scrollNode) return;

  let top = 0;
  let height = 0;
  let scrollViewTopWin = 0;

  const measure = async () => {
    const targetPromise = new Promise<{ top: number; height: number } | null>(
      (resolve) => {
        targetRef.measureLayout(
          scrollNode,
          (_l: number, t: number, _w: number, h: number) =>
            resolve({ top: t, height: h }),
          () => resolve(null),
        );
      },
    );
    const scrollPromise = new Promise<number | null>((resolve) => {
      (scrollView as any).measureInWindow((_x: number, y: number) => resolve(y));
    });
    const [tRes, svTop] = await Promise.all([targetPromise, scrollPromise]);
    if (!tRes || svTop == null) return false;
    top = tRes.top;
    height = tRes.height;
    scrollViewTopWin = svTop;
    return true;
  };

  let prevTop: number | null = null;
  let prevHeight: number | null = null;
  let settled = 0;
  const start = Date.now();

  if (!(await measure())) return;

  while (settled < settleRafs && Date.now() - start < timeoutMs) {
    await raf();
    if (!(await measure())) return;
    if (
      prevTop != null &&
      prevHeight != null &&
      Math.abs(top - prevTop) < 0.5 &&
      Math.abs(height - prevHeight) < 0.5
    ) {
      settled += 1;
    } else {
      settled = 0;
    }
    prevTop = top;
    prevHeight = height;
  }

  const savedCenterViewport = savedCenter - scrollViewTopWin;
  const currentCenterViewport = top + height / 2;

  let contentTopViewport = 0;
  let contentHeight = 0;
  const contentMeasured = await new Promise<boolean>((resolve) => {
    content.measureLayout(
      scrollNode,
      (_l: number, t: number, _w: number, h: number) => {
        contentTopViewport = t;
        contentHeight = h;
        resolve(true);
      },
      () => resolve(false),
    );
  });
  if (!contentMeasured) return;

  const currentScrollY = -contentTopViewport;

  let viewportHeight = 0;
  const viewportMeasured = await new Promise<boolean>((resolve) => {
    (scrollView as any).measure(
      (_x: number, _y: number, _w: number, h: number) => {
        viewportHeight = h;
        resolve(true);
      },
    );
  });
  if (!viewportMeasured) return;

  const deltaViewport = currentCenterViewport - savedCenterViewport;
  const targetY = clamp(
    currentScrollY + deltaViewport,
    0,
    Math.max(0, contentHeight - viewportHeight),
  );

  scrollView.scrollTo({ y: targetY, animated: false });
}

