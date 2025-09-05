import React, { useCallback, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import SaveIndicatorIcon from '@/components/header/SaveIndicatorIcon';
import useSettingsVm from '@components/pages/settings/useSettingsVm';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const vm = useSettingsVm();
  const HeaderRight = useCallback(() => (vm.dirty ? <SaveIndicatorIcon /> : null), [vm.dirty]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerRight: HeaderRight });
  }, [navigation, HeaderRight]);

  return (
    <PageContainer>
      <SettingsContainer {...vm} />
    </PageContainer>
  );
}
