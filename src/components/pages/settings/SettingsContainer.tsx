import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import useAnchorStableScroll, {
  AnchorStableScrollContext,
} from '@/features/scroll/useAnchorStableScroll';
import {
  useStickySelectionPosition,
  StickySelectionPositionContext,
} from '@/features/sticky-position/useStickySelectionPosition';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export default function SettingsContainer() {
  const anchor = useAnchorStableScroll();
  const vm = useSettingsVm(anchor.contextValue.captureBeforeUpdate);
  const { hide } = useSaveIndicator();
  const overlay = useOverlayTransition();
  const sticky = useStickySelectionPosition({
    scrollRef: anchor.scrollRef,
    overlay: { showOpaque: overlay.begin, hide: overlay.end },
    applySelectedChange: async () => {},
  });

  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      vm.handleScroll(e);
       anchor.handleScroll(e);
       sticky.handleScroll(e);
    },
    [vm.handleScroll, anchor.handleScroll, sticky.handleScroll],
  );

  useLayoutEffect(() => {
    void (async () => {
      await waitForOpaque(overlay);
      anchor.adjustAfterLayout();
    })();
  }, [anchor.adjustAfterLayout, vm.settingsVersion, overlay]);

  return (
    <AnchorStableScrollContext.Provider value={anchor.contextValue}>
      <StickySelectionPositionContext.Provider value={sticky}>
        <SettingsContent
          sectionProps={vm.sectionProps}
          theme={vm.theme}
          overlayVisible={vm.overlayVisible}
          overlayColor={vm.overlayColor}
          overlayAnim={vm.overlayAnim}
          overlayBlocks={vm.overlayBlocks}
          onScroll={onScroll}
          scrollRef={anchor.scrollRef}
        />
      </StickySelectionPositionContext.Provider>
    </AnchorStableScrollContext.Provider>
  );
}
