import { IconButton } from '@components/ui/atoms';
import { DiaryList } from '@components/ui/organisms';
import useHeaderShadow from '@hooks/useHeaderShadow';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import type { Diary } from '@types';

const iconOptions = ['book', 'journal', 'document', 'clipboard', 'archive'];

const HomePage: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const theme = useTheme();
  const iconColor: keyof DefaultTheme['colors'] = 'onAccent';
  const handleScroll = useHeaderShadow();

  const addDiary = () => {
    const randomIcon = iconOptions[Math.floor(Math.random() * iconOptions.length)];
    const newDiary: Diary = {
      id: Date.now().toString(),
      icon: randomIcon,
      title: `Diary ${diaries.length + 1}`,
    };
    setDiaries([newDiary, ...diaries]);
  };

  return (
    <>
      <DiaryList data={diaries} style={{ flex: 1 }} onScroll={handleScroll} />
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
    </>
  );
};

const styles = StyleSheet.create({
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
