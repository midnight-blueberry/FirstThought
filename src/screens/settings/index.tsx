import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import useSyncHeaderTheme from '@components/header/useSyncHeaderTheme';

export default function SettingsScreen() {
  useSyncHeaderTheme();
  return (
    <PageContainer>
      <SettingsContainer />
    </PageContainer>
  );
}

