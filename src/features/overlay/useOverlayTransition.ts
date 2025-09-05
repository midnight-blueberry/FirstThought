import { useCallback, useEffect, useRef } from 'react';
import { useOverlayTransition as useOverlayBase, OVERLAY_FADE_OUT_MS } from '@components/settings/overlay/OverlayTransition';

export function useOverlayTransition() {
  const { begin: showOverlay, end: hideOverlay } = useOverlayBase();
  const isTransitioning = useRef(false);
  const timers = useRef<number[]>([]);

  const withOverlay = useCallback(
    async (apply: () => void | Promise<void>) => {
      if (isTransitioning.current) return;
      isTransitioning.current = true;
      showOverlay();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await apply();
      timers.current.push(
        setTimeout(() => {
          hideOverlay();
          isTransitioning.current = false;
        }, OVERLAY_FADE_OUT_MS) as unknown as number,
      );
    },
    [showOverlay, hideOverlay],
  );

  useEffect(
    () =>
      () => {
        timers.current.forEach(clearTimeout);
        hideOverlay();
        isTransitioning.current = false;
      },
    [hideOverlay],
  );

  return { withOverlay };
}
