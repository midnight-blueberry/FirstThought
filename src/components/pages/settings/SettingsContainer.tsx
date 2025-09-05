import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@features/save-indicator';

export default function SettingsContainer() {
  const vm = useSettingsVm();
  const navigation = useNavigation();
  const { reset } = useSaveIndicator();
  const { save } = vm;

  useEffect(() => {
    const onBlur = () => {
      void save();
      reset();
    };
    const unsub = navigation.addListener('blur', onBlur);
    return () => {
      unsub();
      void save();
      reset();
    };
  }, [navigation, reset, save]);
  return <SettingsContent {...vm} />;
}
