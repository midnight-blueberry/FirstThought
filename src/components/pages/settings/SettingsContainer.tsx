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
import { StickySelectionProvider } from '@/features/sticky-position';
import { useOverlayTransition, waitForOpaque } from '@/components/settings/overlay';
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import type { SectionKey } from '@types';
import type { SettingsMode } from './buildSettingsPatch';

interface SettingsContainerProps {
  mode: SettingsMode;
  visibleSectionKeys?: ReadonlyArray<SectionKey>;
}

export default function SettingsContainer({
  mode,
  visibleSectionKeys,
}: SettingsContainerProps) {
  const anchor = useAnchorStableScroll();
  const vm = useSettingsVm(mode, anchor.contextValue.captureBeforeUpdate);
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
    <StickySelectionProvider scrollRef={anchor.scrollRef}>
      <AnchorStableScrollContext.Provider value={anchor.contextValue}>
        <SettingsContent
          sectionProps={vm.sectionProps}
          visibleSectionKeys={visibleSectionKeys}
          theme={vm.theme}
          overlayVisible={vm.overlayVisible}
          overlayColor={vm.overlayColor}
          overlayAnim={vm.overlayAnim}
          overlayBlocks={vm.overlayBlocks}
          onScroll={onScroll}
          scrollRef={anchor.scrollRef}
        />
      </AnchorStableScrollContext.Provider>
    </StickySelectionProvider>
  );
}
