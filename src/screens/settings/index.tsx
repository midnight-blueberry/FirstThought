import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import useHeaderThemeSync from '@components/header/useHeaderThemeSync';

export default function SettingsScreen() {
  const statusBar = useHeaderThemeSync({ transparent: false });

  return (
    <>
      {statusBar}
      <PageContainer>
        <SettingsContainer />
      </PageContainer>
    </>
  );
}

