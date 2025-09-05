import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import SettingsContent from './SettingsContent';
import type { SettingsVm } from './useSettingsVm.types';

export default function SettingsContainer(props: SettingsVm) {
  const navigation = useNavigation();
  const { save, sectionProps, theme, handleScroll } = props;

  useEffect(() => {
    const onBlur = () => {
      void save();
    };
    const unsub = navigation.addListener('blur', onBlur);
    return () => {
      unsub();
      void save();
    };
  }, [navigation, save]);

  return (
    <SettingsContent
      sectionProps={sectionProps}
      theme={theme}
      handleScroll={handleScroll}
    />
  );
}
