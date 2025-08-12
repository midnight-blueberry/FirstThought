import AppText from '@/components/ui/atoms/app-text';
import AppButton from '@/components/ui/atoms/button-with-text';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import { themeList } from '@/theme';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const lift = theme.spacing.small / 2;

  const handleSave = () => {
    const chosenTheme = themeList.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      setTheme(chosenTheme);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppText variant='large' style={styles.title}>Настройки</AppText>

      <AppText variant='large' style={styles.label}>Тема</AppText>
      <View style={styles.themeList}>
        {themeList.map(themeItem => (
          <TouchableOpacity
            key={themeItem.name}
            activeOpacity={1}
            style={[
              styles.themeOption,
              {
                borderColor: theme.colors.background,
                borderWidth: theme.borderWidth,
                borderRadius: theme.borderRadius,
                paddingRight: theme.iconSize.large + theme.spacing.medium * 2,
                paddingVertical: theme.spacing.medium,
                minHeight: theme.iconSize.large + theme.spacing.medium * 2,
                justifyContent: 'center',
              },
              themeItem.name === selectedThemeName && {
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setSelectedThemeName(themeItem.name)}
          >
            <AppText variant='medium' style={{ transform: [{ translateY: -lift }] }}>
              {themeItem.name}
            </AppText>
            <View
              style={{
                position: 'absolute',
                top: theme.spacing.medium,
                right: theme.spacing.medium,
                bottom: theme.spacing.medium,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [{ translateY: -lift }],
              }}
            >
              <Ionicons
                name="checkmark-sharp"
                size={theme.iconSize.large}
                color={theme.colors.primary}
                style={{
                  opacity: themeItem.name === selectedThemeName ? 1 : 0,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
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
  label: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  themeList: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
  },
});
