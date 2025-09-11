import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import { StickySelectionProvider } from '@/features/sticky-position/StickySelectionProvider';

export default function SettingsScreen() {
  return (
    <StickySelectionProvider>
      <PageContainer>
        <SettingsContainer />
      </PageContainer>
    </StickySelectionProvider>
  );
}

