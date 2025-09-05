import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import { SaveIndicatorProvider } from '@components/header/SaveIndicator';

export default function SettingsScreen() {
  return (
    <SaveIndicatorProvider>
      <PageContainer>
        <SettingsContainer />
      </PageContainer>
    </SaveIndicatorProvider>
  );
}

