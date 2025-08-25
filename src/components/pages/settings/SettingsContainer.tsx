import React from 'react';
import SettingsContent from './SettingsContent';
import useSettingsVm from './useSettingsVm';

export default function SettingsContainer() {
  const vm = useSettingsVm();
  return <SettingsContent {...vm} />;
}
