import React, { useEffect } from 'react';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';
import { useSaveIndicator } from '@components/header/SaveIndicator';

export default function SettingsContainer() {
  const vm = useSettingsVm();
  const { hide } = useSaveIndicator();
  useEffect(() => {
    return () => {
      hide();
    };
  }, [hide]);
  return <SettingsContent {...vm} />;
}
