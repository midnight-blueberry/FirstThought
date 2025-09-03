import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import { OverlayTransitionProvider } from '@components/settings/overlay/OverlayTransition';

export default function SettingsScreen() {
  return (
    <OverlayTransitionProvider>
      <PageContainer>
        <SettingsContainer />
      </PageContainer>
    </OverlayTransitionProvider>
  );
}

