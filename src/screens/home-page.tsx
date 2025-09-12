import HomePage from '@components/pages/home-page';
import PageContainer from '@components/common/PageContainer';
import useHeaderThemeSync from '@components/header/useHeaderThemeSync';

export default function HomePageScreen() {
  const statusBar = useHeaderThemeSync({ transparent: false });

  return (
    <>
      {statusBar}
      <PageContainer>
        <HomePage />
      </PageContainer>
    </>
  );
}

