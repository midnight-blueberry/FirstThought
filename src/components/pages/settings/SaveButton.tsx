import React, { useCallback } from 'react';

import { IconButton } from '@components/ui/atoms';
import { useSettings } from '@/state/SettingsContext';

const SaveButton: React.FC = () => {
  const { saveSettings, setDirty } = useSettings();

  const handlePress = useCallback(async () => {
    await saveSettings();
    setDirty(false);
  }, [saveSettings, setDirty]);

  return <IconButton icon="save-outline" onPress={handlePress} />;
};

export default SaveButton;

