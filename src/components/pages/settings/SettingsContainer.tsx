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
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export default function SettingsContainer() {
  const anchor = useAnchorStableScroll();
  const vm = useSettingsVm();
  const { hide } = useSaveIndicator();
  const overlay = useOverlayTransition();

  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      vm.handleScroll(e);
      anchor.setLastScrollY(e.nativeEvent.contentOffset.y);
    },
    [vm.handleScroll, anchor.setLastScrollY],
  );

  useLayoutEffect(() => {
    void (async () => {
      await waitForOpaque(overlay);
      anchor.adjustAfterLayout(anchor.scrollRef.current);
    })();
  }, [anchor.adjustAfterLayout, vm.settingsVersion, overlay]);

  return (
    <AnchorStableScrollContext.Provider value={anchor.contextValue}>
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
    </AnchorStableScrollContext.Provider>
  );
}
