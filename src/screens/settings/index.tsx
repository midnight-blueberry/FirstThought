import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import useHeaderThemeSync from '@components/header/useHeaderThemeSync';
import { IconButton } from '@components/ui/atoms';
import { SettingRow } from '@components/ui/molecules';
import useTheme from '@hooks/useTheme';
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

const MENU_TITLE = 'Настройки';
const APP_APPEARANCE_TITLE = 'Общее';
const NOTES_APPEARANCE_TITLE = 'Заметки';

export default function SettingsScreen() {
  const statusBar = useHeaderThemeSync({ transparent: false });
  const theme = useTheme();
  const navigation = useNavigation();
  const [view, setView] = React.useState<SettingsView>('menu');

  const currentTitle = React.useMemo(() => {
    if (view === 'appAppearance') {
      return APP_APPEARANCE_TITLE;
    }

    if (view === 'notesAppearance') {
      return NOTES_APPEARANCE_TITLE;
    }

    return MENU_TITLE;
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
      headerBackVisible: false,
      headerLeft: () => (
        <View style={{ width: theme.buttonSizes.small, height: theme.buttonSizes.small }}>
          <IconButton
            icon="chevron-back"
            color="headerForeground"
            onPress={onHeaderBackPress}
            style={{
              width: '100%',
              height: '100%',
              paddingHorizontal: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </View>
      ),
    });
  }, [currentTitle, navigation, onHeaderBackPress, theme.buttonSizes.small]);

  const menuItemSpacing = theme.padding.xlarge;

  const menu = (
    <View style={[styles.menu, { paddingHorizontal: theme.padding.xlarge, paddingTop: theme.padding.xlarge }]}>
      <SettingRow
        title={APP_APPEARANCE_TITLE}
        icon={<Ionicons name="settings-outline" size={theme.iconSize.large} color={theme.colors.basic} />}
        style={{ marginBottom: menuItemSpacing }}
        onPress={() => {
          setView('appAppearance');
        }}
      />
      <SettingRow
        title={NOTES_APPEARANCE_TITLE}
        icon={<Ionicons name="document-text-outline" size={theme.iconSize.large} color={theme.colors.basic} />}
        style={{ marginBottom: 0 }}
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


