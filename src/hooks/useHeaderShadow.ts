import { useCallback } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default function useHeaderShadow() {
  return useCallback(
    (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Header style is static; scroll should not toggle elevation/shadow.
    },
    [],
  );
}
