import HomePage from '@components/pages/home-page';
import PageContainer from '@components/common/PageContainer';
import useSyncHeaderTheme from '@components/header/useSyncHeaderTheme';

export default function HomePageScreen() {
  useSyncHeaderTheme();
  return (
    <PageContainer>
      <HomePage />
    </PageContainer>
  );
}

