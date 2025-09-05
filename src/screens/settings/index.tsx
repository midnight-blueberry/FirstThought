import React, { useLayoutEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import SaveIndicatorIcon from '@/components/header/SaveIndicator';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const headerRight = useMemo(() => () => <SaveIndicatorIcon />, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight,
      headerRightContainerStyle: { marginRight: 12 },
    });
  }, [navigation, headerRight]);

  return (
    <PageContainer>
      <SettingsContainer />
    </PageContainer>
  );
}
