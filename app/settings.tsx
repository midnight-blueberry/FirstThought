import AppText from '@/components/ui/atoms/app-text';
import AppButton from '@/components/ui/atoms/button-with-text';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useContext, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { themeList } from '@/theme';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;

  const handleSave = () => {
    const chosenTheme = themeList.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      setTheme(chosenTheme);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppText variant='large' style={styles.title}>Настройки</AppText>

      <View style={styles.switchContainer}>
        <AppText variant='medium'>Светлая</AppText>
        <Switch
          value={selectedThemeName === 'Темная'}
          onValueChange={value => setSelectedThemeName(value ? 'Темная' : 'Светлая')}
        />
        <AppText variant='medium'>Темная</AppText>
      </View>

      <AppButton title="Сохранить" type="primary" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
});
