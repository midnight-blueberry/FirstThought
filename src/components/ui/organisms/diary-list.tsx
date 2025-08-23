import React from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';
import { AppText } from '@components/ui/atoms';
import type { Diary } from '@types';

type DiaryListProps = {
  data: Diary[];
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  style?: StyleProp<ViewStyle>;
};

const DiaryList: React.FC<DiaryListProps> = ({ data, onScroll, style }: DiaryListProps) => {
  const theme = useTheme();

  const renderItem = ({ item }: { item: Diary }) => (
    <View
      style={[
        styles.itemContainer,
        {
          padding: theme.padding.large,
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius,
          borderColor: theme.colors.accent,
          borderWidth: theme.borderWidth.medium,
          marginBottom: theme.margin.medium,
        },
      ]}
    >
      <Ionicons
        name={item.icon}
        size={theme.iconSize.small}
        color={theme.colors.basic}
      />
      <AppText style={{ marginLeft: theme.margin.large }} color="basic">
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
        paddingLeft: theme.padding.medium,
        paddingRight: theme.padding.small,
      }}
      onScroll={onScroll}
      scrollEventThrottle={16}
      style={[style]}
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
