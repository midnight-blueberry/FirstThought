import ButtonWithIcon from '@/components/ui/atoms/button-with-icon';
import DiaryList from '@/components/ui/organisms/diary-list';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import { useTheme } from 'styled-components/native';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

type RootStackParamList = {
  Home: { onIncreaseFont: () => void; onDecreaseFont: () => void };
};

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  route: HomeRouteProp;
  navigation: any;
};

const iconOptions = ['book', 'journal', 'document', 'clipboard', 'archive'];

const HomePage: React.FC<Props> = ({ route, navigation }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const theme = useTheme();

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
    <View style={[ styles.container, { backgroundColor: theme.colors.background }]}>
      <DiaryList data={diaries} />
      <ButtonWithIcon onPress={addDiary} iconName='add' />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomePage;
