import React from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';

interface Diary {
  id: string;
  icon: string;
  title: string;
}

type DiaryListProps = {
  data: Diary[];
};

const DiaryList: React.FC<DiaryListProps> = ({ data }: DiaryListProps) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: Diary }) => (
    <View
      style={[
        styles.itemContainer,
        {
          padding: theme.spacing.large,
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius,
          borderColor: theme.colors.primary,
          borderWidth: theme.borderWidth,
          marginBottom: theme.spacing.medium,
        },
      ]}
    >
      <Ionicons
        name={item.icon}
        size={theme.iconSize.small}
        color={theme.colors.text}
      />
      <AppText style={{ marginLeft: theme.spacing.large }} color="text">
        {item.title}
      </AppText>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingLeft: theme.spacing.medium,
        paddingRight: theme.padding.small,
      }}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DiaryList;
