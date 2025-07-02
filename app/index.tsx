import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const [search, setSearch] = useState<string>('');
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

  const renderItem = ({ item }: { item: Diary }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.icon} size={24} />
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Diary List */}
      <FlatList
        data={diaries.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={addDiary}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  searchInput: {
    flex: 1,
    marginLeft: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8
  },
  listContent: {
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16
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