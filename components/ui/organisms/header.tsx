import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MenuIcon from '../atoms/menu-icon';
import SearchField from '../atoms/search-field';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

const iconOptions = ['book', 'journal', 'document', 'clipboard', 'archive'];

const HomePage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [diaries, setDiaries] = useState<Diary[]>([]);

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
    <View style={styles.header}>
        <MenuIcon />
        <SearchField />
    </View>
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
    padding: 16
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8
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