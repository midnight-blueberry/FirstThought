import React, { useCallback, useEffect, useRef } from 'react';
import type { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';
import {
  StickySelectionPositionContext,
  useStickySelectionPosition,
} from '@/features/sticky-position/useStickySelectionPosition';

export default function SettingsContainer() {
  const scrollRef = useRef<ScrollView>(null!);
  const vm = useSettingsVm();
  const { hide } = useSaveIndicator();
  const overlay = useOverlayTransition();
  const sticky = useStickySelectionPosition({
    scrollRef,
    overlay: {
      showOpaque: async () => {
        await overlay.begin();
        await waitForOpaque(overlay);
      },
      hide: overlay.end,
    },
    applySelectedChange: vm.applySelectedChange,
  });

  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      vm.handleScroll(e);
      sticky.onScroll(e);
    },
    [vm.handleScroll, sticky],
  );

  return (
    <StickySelectionPositionContext.Provider value={sticky}>
      <SettingsContent
        sectionProps={vm.sectionProps}
        theme={vm.theme}
        overlayVisible={vm.overlayVisible}
        overlayColor={vm.overlayColor}
        overlayAnim={vm.overlayAnim}
        overlayBlocks={vm.overlayBlocks}
        onScroll={onScroll}
        scrollRef={scrollRef}
      />
    </StickySelectionPositionContext.Provider>
  );
}
