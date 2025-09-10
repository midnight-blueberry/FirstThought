import { useCallback } from 'react';
import {
  useOverlayTransition,
  waitForOpaque as waitForOverlay,
} from '@components/settings/overlay/OverlayTransition';

export default function useOverlayOpaque() {
  const overlay = useOverlayTransition();
  return useCallback(() => waitForOverlay(overlay), [overlay]);
}
