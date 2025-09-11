import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import useAnchorStableScroll, {
  AnchorStableScrollContext,
} from '@/features/scroll/useAnchorStableScroll';
import { StickySelectionProvider } from '@/features/sticky-position/StickySelectionProvider';
import {
  useOverlayTransition,
  waitForOpaque,
} from '@components/settings/overlay/OverlayTransition';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';

export default function SettingsContainer() {
  const anchor = useAnchorStableScroll();
  const contentRef = useRef<View | null>(null);
  const vm = useSettingsVm(
    anchor.contextValue.captureBeforeUpdate,
    anchor.scrollRef,
    contentRef,
  );
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
      anchor.handleScroll(e);
    },
    [vm.handleScroll, anchor.handleScroll],
  );

  useLayoutEffect(() => {
    void (async () => {
      await waitForOpaque(overlay);
      anchor.adjustAfterLayout();
    })();
  }, [anchor.adjustAfterLayout, vm.settingsVersion, overlay]);

  return (
    <StickySelectionProvider>
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
          contentRef={contentRef}
        />
      </AnchorStableScrollContext.Provider>
    </StickySelectionProvider>
  );
}
