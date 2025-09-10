import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@components/header/SaveIndicator';
import useStableAnchor, { StableAnchorContext } from '@/features/scroll/useStableAnchor';
import useOverlayOpaque from '@/features/overlay/useOverlayOpaque';
import type { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

export default function SettingsContainer() {
  const scrollRef = useRef<ScrollView>(null);
  const {
    setLastScrollY,
    captureBeforeUpdate,
    adjustAfterLayout,
    setContentSize,
    setViewportHeight,
    contextValue,
  } = useStableAnchor();
  const vm = useSettingsVm(captureBeforeUpdate);
  const { hide } = useSaveIndicator();
  const waitForOpaque = useOverlayOpaque();

  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      vm.handleScroll(e);
      setLastScrollY(e.nativeEvent.contentOffset.y);
    },
    [vm.handleScroll, setLastScrollY],
  );

  useLayoutEffect(() => {
    void (async () => {
      await adjustAfterLayout(scrollRef.current, waitForOpaque);
    })();
  }, [adjustAfterLayout, waitForOpaque, vm.settingsVersion]);

  return (
    <StableAnchorContext.Provider value={contextValue}>
      <SettingsContent
        sectionProps={vm.sectionProps}
        theme={vm.theme}
        overlayVisible={vm.overlayVisible}
        overlayColor={vm.overlayColor}
        overlayAnim={vm.overlayAnim}
        overlayBlocks={vm.overlayBlocks}
        onScroll={onScroll}
        scrollRef={scrollRef}
        onContentSizeChange={(_w, h) => setContentSize(h)}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
      />
    </StableAnchorContext.Provider>
  );
}
