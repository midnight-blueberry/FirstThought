import React from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import SettingsContainer from '@components/pages/settings/SettingsContainer';
import PageContainer from '@components/common/PageContainer';
import useHeaderThemeSync from '@components/header/useHeaderThemeSync';
import { AppText, IconButton } from '@components/ui/atoms';
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

export default function SettingsScreen() {
  const statusBar = useHeaderThemeSync({ transparent: false });
  const theme = useTheme();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [view, setView] = React.useState<SettingsView>('menu');
  const showSaveIcon = view !== 'menu';

  const headerSideSize = React.useMemo(() => theme.buttonSizes.small, [theme.buttonSizes.small]);

  const currentTitle = React.useMemo(() => {
    if (view === 'appAppearance') {
      return '\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f';
    }

    if (view === 'notesAppearance') {
      return '\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434 \u0437\u0430\u043c\u0435\u0442\u043e\u043a';
    }

    return '\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438';
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
      headerShown: false,
      title: currentTitle,
    });
  }, [currentTitle, navigation]);

  const menu = (
    <View style={styles.menu}>
      <SettingRow
        title="\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434 \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u044f"
        onPress={() => {
          setView('appAppearance');
        }}
      />
      <SettingRow
        title="\u0412\u043d\u0435\u0448\u043d\u0438\u0439 \u0432\u0438\u0434 \u0437\u0430\u043c\u0435\u0442\u043e\u043a"
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.background,
              paddingTop: top,
            },
          ]}
        >
          <View style={[styles.headerSide, { width: headerSideSize, height: headerSideSize }]}>
            <IconButton
              icon="chevron-back"
              color="headerForeground"
              onPress={onHeaderBackPress}
              style={styles.headerButton}
            />
          </View>

          <View style={styles.headerTitleWrap}>
            <AppText
              numberOfLines={1}
              style={[
                styles.headerTitle,
                {
                  color: theme.colors.headerForeground,
                  fontSize: theme.typography.header.headerTitleSize,
                  lineHeight: theme.typography.header.headerTitleLineHeight,
                },
              ]}
            >
              {currentTitle}
            </AppText>
          </View>

          <View style={[styles.headerSide, { width: headerSideSize, height: headerSideSize }]}>
            {showSaveIcon ? (
              <Ionicons
                name="save-outline"
                size={theme.iconSize.large}
                color={theme.colors.headerForeground}
              />
            ) : null}
          </View>
        </View>

        <View style={styles.content}>
          {view === 'menu' ? menu : null}
          {view === 'appAppearance' ? (
            <SettingsContainer visibleSectionKeys={APP_APPEARANCE_SECTION_KEYS} />
          ) : null}
          {view === 'notesAppearance' ? (
            <SettingsContainer visibleSectionKeys={NOTES_APPEARANCE_SECTION_KEYS} />
          ) : null}
        </View>
      </PageContainer>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerSide: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerButton: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    width: '100%',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  menu: {
    flex: 1,
  },
});
