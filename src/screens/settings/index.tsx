import React, { useEffect } from 'react';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import SaveIndicator, {
  SaveIndicatorProvider,
  useSaveIndicator,
} from '@components/header/SaveIndicator';
import { useNavigation } from '@react-navigation/native';

function SettingsScreenInner() {
  const navigation = useNavigation();
  const { dirty, clearDirty } = useSaveIndicator();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveIndicator visible={dirty} />,
    });
  }, [navigation, dirty]);

  useEffect(() => {
    const unsub = navigation.addListener('blur', clearDirty);
    return unsub;
  }, [navigation, clearDirty]);

  return (
    <PageContainer>
      <SettingsContainer />
    </PageContainer>
  );
}

export default function SettingsScreen() {
  return (
    <SaveIndicatorProvider>
      <SettingsScreenInner />
    </SaveIndicatorProvider>
  );
}

