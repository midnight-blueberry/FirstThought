import IconButton from '@/components/ui/atoms/icon-button';
import DiaryList from '@/components/ui/organisms/diary-list';
import Header from '@/components/ui/organisms/header';
import SearchField from '@/components/ui/molecules/input-field';
import React, { useState } from 'react';
import { StyleSheet, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { DefaultTheme, useTheme } from 'styled-components/native';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

const iconOptions = ['book', 'journal', 'document', 'clipboard', 'archive'];

const HomePage: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [showShadow, setShowShadow] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const iconColor: keyof DefaultTheme['colors'] =
    theme.name === 'Темная' ? 'background' : 'basic';

  const addDiary = () => {
    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const newDiary: Diary = {
      id: Date.now().toString(),
      icon: randomIcon,
      title: `Diary ${diaries.length + 1}`,
    };
    setDiaries([newDiary, ...diaries]);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowShadow(event.nativeEvent.contentOffset.y > 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Header showShadow={showShadow}>
        <IconButton
          icon="menu"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          size={theme.iconSize.xlarge}
        />
        <SearchField placeholder="Поиск по всем дневникам..." />
      </Header>
      <DiaryList data={diaries} onScroll={handleScroll} style={{ flex: 1 }} />
      <IconButton
        icon='add'
        onPress={addDiary}
        color={iconColor}
        size={theme.iconSize.medium}
        style={[
          styles.addDiaryButton,
          {
            backgroundColor: theme.colors.accent,
            width: theme.buttonSizes.medium,
            height: theme.buttonSizes.medium,
            borderRadius: theme.buttonSizes.medium / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addDiaryButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default HomePage;
