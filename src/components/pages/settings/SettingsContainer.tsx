import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@features/save-indicator';

export default function SettingsContainer() {
  const vm = useSettingsVm();
  const navigation = useNavigation();
  const { reset } = useSaveIndicator();

  useEffect(() => {
    const unsub = navigation.addListener('blur', reset);
    return () => {
      unsub();
      reset();
    };
  }, [navigation, reset]);
  return <SettingsContent {...vm} />;
}
