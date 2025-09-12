import type { AlignScrollAfterApplyParams } from './stickyTypes';

const raf = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function alignScrollAfterApply({
  scrollRef,
  targetRef,
  yCenterOnScreen,
  scrollYRef,
  timeoutMs = 300,
  maxRafs = 3,
}: AlignScrollAfterApplyParams) {
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

  await Promise.race([doAlign(maxRafs), delay(timeoutMs)]);
}
