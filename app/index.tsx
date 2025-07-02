import AppButton from '@/components/ui/atoms/app-button';
import DiaryList from '@/components/ui/organisms/diary-list';
import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet
} from 'react-native';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

type RootStackParamList = {
  Home: { onIncreaseFont: Function, onDecreaseFont: Function };
};

type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  route: HomeRouteProp;
  navigation: any;
};

const iconOptions = ['book', 'journal', 'document', 'clipboard', 'archive'];

const HomePage: React.FC<Props> = ({ route, navigation }) => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  //const { onIncreaseFont, onDecreaseFont } = route.params;

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
    <SafeAreaView style={styles.container}>
      <DiaryList data={diaries} />
      <AppButton onPress={addDiary} styles={{ button: styles.fab, text: styles.fabIcon }}>+</AppButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 28
  }
}); 

export default HomePage;