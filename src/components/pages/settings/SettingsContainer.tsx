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
import type {
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

export default function SettingsContainer() {
  const anchor = useAnchorStableScroll();
  const vm = useSettingsVm();
  const { hide } = useSaveIndicator();

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
    void anchor.adjustAfterLayout();
  }, [anchor.adjustAfterLayout, vm.settingsVersion]);

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
