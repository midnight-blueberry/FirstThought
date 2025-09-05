import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import type { DrawerScreenProps } from '@react-navigation/drawer';

import PageContainer from '@components/common/PageContainer';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import SaveButton from '@components/pages/settings/SaveButton';
import type { DrawerParamList } from '@/navigation/types';
import { useSettings } from '@/state/SettingsContext';

type Props = DrawerScreenProps<DrawerParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { isDirty } = useSettings();
  const renderSave = useCallback(() => <SaveButton />, []);

  useLayoutEffect(() => {
    if (isDirty) {
      navigation.setOptions({ headerRight: renderSave });
    } else {
      navigation.setOptions({ headerRight: undefined });
    }
  }, [isDirty, navigation, renderSave]);

  useEffect(() => {
    return () => {
      navigation.setOptions({ headerRight: undefined });
    };
  }, [navigation]);

  return (
    <PageContainer>
      <SettingsContainer />
    </PageContainer>
  );
}

