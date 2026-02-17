import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import useHeaderThemeSync from '@components/header/useHeaderThemeSync';
import { IconButton } from '@components/ui/atoms';
import { SettingRow } from '@components/ui/molecules';
import type { SectionKey } from '@types';

type SettingsView = 'menu' | 'appAppearance' | 'notesAppearance';

const APP_APPEARANCE_SECTION_KEYS: ReadonlyArray<SectionKey> = [
  'theme',
  'accent',
  'divider',
  'font',
  'fontSize',
  'fontWeight',
];

const NOTES_APPEARANCE_SECTION_KEYS: ReadonlyArray<SectionKey> = ['align', 'preview'];

export default function SettingsScreen() {
  const statusBar = useHeaderThemeSync({ transparent: false });
  const navigation = useNavigation();
  const [view, setView] = React.useState<SettingsView>('menu');

  const currentTitle = React.useMemo(() => {
    if (view === 'appAppearance') {
      return 'Внешний вид приложения';
    }

    if (view === 'notesAppearance') {
      return 'Внешний вид заметок';
    }

    return 'Настройки';
  }, [view]);

  const handleBackPress = React.useCallback(() => {
    if (view !== 'menu') {
      setView('menu');
      return true;
    }

    return false;
  }, [view]);

  const onHeaderBackPress = React.useCallback(() => {
    if (!handleBackPress()) {
      navigation.goBack();
    }
  }, [handleBackPress, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (handleBackPress()) {
          return true;
        }

        return false;
      });

      return () => {
        subscription.remove();
      };
    }, [handleBackPress]),
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: currentTitle,
      headerLeft: () => <IconButton icon="chevron-back" color="basic" onPress={onHeaderBackPress} />,
    });
  }, [currentTitle, navigation, onHeaderBackPress]);

  const menu = (
    <View style={styles.menu}>
      <SettingRow
        title="Внешний вид приложения"
        onPress={() => {
          setView('appAppearance');
        }}
      />
      <SettingRow
        title="Внешний вид заметок"
        onPress={() => {
          setView('notesAppearance');
        }}
      />
    </View>
  );

  return (
    <>
      {statusBar}
      <PageContainer>
        {view === 'menu' ? menu : null}
        {view === 'appAppearance' ? (
          <SettingsContainer visibleSectionKeys={APP_APPEARANCE_SECTION_KEYS} />
        ) : null}
        {view === 'notesAppearance' ? (
          <SettingsContainer visibleSectionKeys={NOTES_APPEARANCE_SECTION_KEYS} />
        ) : null}
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
  },
});
