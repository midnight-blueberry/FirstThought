import { useCallback } from 'react';
import { useOverlayTransition } from '@components/settings/overlay/OverlayTransition';

export default function useOverlayOpaque() {
  const overlay = useOverlayTransition();
  return useCallback(
    () =>
      new Promise<void>((resolve) => {
        if (overlay.isOpaque()) {
          resolve();
          return;
        }
        const start = Date.now();
        const check = () => {
          if (overlay.isOpaque() || Date.now() - start > 300) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        check();
      }),
    [overlay],
  );
}
