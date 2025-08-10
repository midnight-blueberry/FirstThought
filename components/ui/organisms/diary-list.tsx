import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

type DiaryListProps = {
  data: Diary[];
};

const DiaryList: React.FC<DiaryListProps> = ({ data }: DiaryListProps) => {

  const renderItem = ({ item }: { item: Diary }) => (
    <View style={styles.itemContainer}>
      <Ionicons name={item.icon} size={24} />
      <Text style={styles.itemText}>{item.title}</Text>
    </View>
  );

  return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
  )
};

const styles = StyleSheet.create({
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
  }
}); 

export default DiaryList;
