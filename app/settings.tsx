import AppText from '@/components/ui/atoms/app-text';
import SavedLabel from '@/components/ui/atoms/saved-label';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import { themeList } from '@/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { accentColors } from '@/constants/AccentColors';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const [ isSaved, setIsSaved ] = useState(false);
  const [ glintKey, setGlintKey ] = useState(0);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const lift = theme.spacing.small / 2;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
    }, [theme.name, theme.colors.accent])
  );

  const handleSave = useCallback(() => {
    const chosenTheme = themeList.find(t => t.name === selectedThemeName);
    if (chosenTheme) {
      const updatedColors = {
        ...chosenTheme.colors,
        accent: selectedAccentColor,
      };
      if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
        updatedColors.basic = selectedAccentColor;
      }
      setTheme({ ...chosenTheme, colors: updatedColors });
    }
  }, [selectedThemeName, selectedAccentColor, setTheme]);

  const saveWithFeedback = useCallback(() => {
    handleSave();
    setIsSaved(true);
    setGlintKey(k => k + 1);
    fadeAnim.stopAnimation();
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(() => setIsSaved(false));
    }, 3000);
  }, [handleSave, fadeAnim]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    saveWithFeedback();
  }, [selectedThemeName, selectedAccentColor, saveWithFeedback]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name='chevron-back'
            size={theme.iconSize.large}
            color={theme.colors.basic}
          />
        </TouchableOpacity>
        <AppText variant='large' style={styles.title}>Настройки</AppText>
      </View>

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
                borderWidth: theme.borderWidth.medium,
                borderRadius: theme.borderRadius,
                paddingRight: theme.iconSize.large + theme.spacing.medium * 2,
                paddingVertical: theme.spacing.medium,
                paddingLeft: theme.spacing.medium,
                minHeight: theme.iconSize.large + theme.spacing.medium * 2,
                justifyContent: 'center',
              },
              themeItem.name === selectedThemeName && {
                borderColor: theme.colors.accent,
              },
            ]}
            onPress={() => setSelectedThemeName(themeItem.name)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: theme.iconSize.small,
                  height: theme.iconSize.small,
                  backgroundColor: themeItem.colors.background,
                  borderRadius: theme.borderRadius / 2,
                  marginRight: theme.spacing.medium,
                  borderColor: theme.colors.basic,
                  borderWidth: theme.borderWidth.xsmall,
                }}
              />
              <AppText variant='medium' style={{ transform: [{ translateY: -lift }] }}>
                {themeItem.name}
              </AppText>
            </View>
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
                color={theme.colors.accent}
                style={{
                  opacity: themeItem.name === selectedThemeName ? 1 : 0,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <AppText variant='large' style={[styles.label, styles.accentLabel]}>Акцент</AppText>
      <View style={styles.themeList}>
        {accentColors.map(color => (
          <TouchableOpacity
            key={color.hex}
            activeOpacity={1}
            style={[
              styles.themeOption,
              {
                borderColor: theme.colors.background,
                borderWidth: theme.borderWidth.medium,
                borderRadius: theme.borderRadius,
                paddingRight: theme.iconSize.large + theme.spacing.medium * 2,
                paddingVertical: theme.spacing.medium,
                paddingLeft: theme.spacing.medium,
                minHeight: theme.iconSize.large + theme.spacing.medium * 2,
                justifyContent: 'center',
              },
              color.hex === selectedAccentColor && {
                borderColor: color.hex,
              },
            ]}
            onPress={() => setSelectedAccentColor(color.hex)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: theme.iconSize.small,
                  height: theme.iconSize.small,
                  backgroundColor: color.hex,
                  borderRadius: theme.borderRadius / 2,
                  marginRight: theme.spacing.medium,
                }}
              />
              <AppText variant='medium' style={{ transform: [{ translateY: -lift }] }}>
                {color.name}
              </AppText>
            </View>
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
                color={theme.colors.accent}
                style={{
                  opacity: color.hex === selectedAccentColor ? 1 : 0,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {isSaved && (
        <Animated.View style={[styles.saveNotice, { opacity: fadeAnim, width: '100%' }]}>
          <SavedLabel title="Сохранено" glintKey={glintKey} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    left: -4,
    padding: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  label: {
    marginTop: 24,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  accentLabel: {
    marginTop: 4,
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  themeList: {
    marginBottom: 4,
  },
  saveNotice: {
    marginTop: 'auto',
  },
});
