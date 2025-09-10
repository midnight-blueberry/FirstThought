import { useCallback } from 'react';
import { useOverlayTransition, waitForOpaque } from '@components/settings/overlay/OverlayTransition';

export default function useOverlayOpaque() {
  const overlay = useOverlayTransition();
  return useCallback(() => waitForOpaque(overlay), [overlay]);
}
