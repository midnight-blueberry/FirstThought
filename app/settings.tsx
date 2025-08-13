import AppText from '@/components/ui/atoms/app-text';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import { themeList } from '@/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { accentColors } from '@/constants/AccentColors';
import { sizes } from '@/theme/tokens';
import { saveSettings } from '@/src/storage/settings';

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ blinkIndex, setBlinkIndex ] = useState<number | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [ isSaved, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const lift = theme.spacing.small / 2;
  const optionPaddingLeft = theme.spacing.medium + (theme.iconSize.large - theme.iconSize.small) / 2;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      const base = sizes.fontSize.small;
      const level = Math.round((theme.fontSize.small - base) / 2) + 3;
      setFontSizeLevel(level);
    }, [theme.name, theme.colors.accent, theme.fontSize.small])
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
      const delta = (fontSizeLevel - 3) * 2;
      const updatedFontSize = {
        small: chosenTheme.fontSize.small + delta,
        medium: chosenTheme.fontSize.medium + delta,
        large: chosenTheme.fontSize.large + delta,
        xlarge: chosenTheme.fontSize.xlarge + delta,
      };
      setTheme({ ...chosenTheme, colors: updatedColors, fontSize: updatedFontSize });
    }
  }, [selectedThemeName, selectedAccentColor, fontSizeLevel, setTheme]);

  const saveWithFeedback = useCallback(() => {
    handleSave();
    saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel });
    setIsSaved(true);
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
  }, [handleSave, fadeAnim, selectedThemeName, selectedAccentColor, fontSizeLevel]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const triggerBlink = useCallback((index: number) => {
    blinkAnim.stopAnimation();
    setBlinkIndex(index);
    blinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 5 }
    ).start(() => setBlinkIndex(null));
  }, [blinkAnim]);

  const stopBlink = useCallback(() => {
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
    setBlinkIndex(null);
  }, [blinkAnim]);

  const decreaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    setFontSizeLevel(l => {
      if (l <= 1) {
        triggerBlink(0);
        return l;
      }
      return l - 1;
    });
  };

  const increaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    setFontSizeLevel(l => {
      if (l >= 6) {
        triggerBlink(5);
        return l;
      }
      return l + 1;
    });
  };

  const isInitialRender = useRef(true);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    saveWithFeedback();
  }, [selectedThemeName, selectedAccentColor, fontSizeLevel, saveWithFeedback]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={[
          styles.header,
          {
            height: theme.iconSize.large + theme.spacing.small * 2,
            paddingTop: theme.spacing.small,
            paddingBottom: theme.spacing.small,
            borderBottomColor: theme.colors.basic,
            borderBottomWidth: theme.borderWidth.small,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              left: theme.padding.small,
              paddingHorizontal: theme.spacing.small,
            },
          ]}
        >
          <Ionicons
            name='chevron-back'
            size={theme.iconSize.large}
            color={theme.colors.basic}
          />
        </TouchableOpacity>
        <AppText variant='large' style={styles.title}>
          Настройки
        </AppText>
        {isSaved && (
          <Animated.View
            pointerEvents='none'
            style={[
              styles.saveIcon,
              {
                right: theme.padding.small,
                paddingHorizontal: theme.spacing.small,
                opacity: fadeAnim,
              },
            ]}
          >
            <Ionicons
              name='save-outline'
              size={theme.iconSize.large}
              color={theme.colors.basic}
            />
          </Animated.View>
        )}
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
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
                paddingLeft: optionPaddingLeft,
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
                  marginRight: optionPaddingLeft,
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
                paddingLeft: optionPaddingLeft,
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
                  marginRight: optionPaddingLeft,
                  borderColor: theme.colors.basic,
                  borderWidth: theme.borderWidth.xsmall,
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

      <AppText variant='large' style={[styles.label, styles.fontSizeLabel]}>Размер шрифта</AppText>
      <View style={styles.fontSizeContainer}>
        <View style={styles.fontSizeSide}>
          <TouchableOpacity onPress={decreaseFontSize} activeOpacity={1}>
            <Ionicons
              name='remove'
              size={theme.iconSize.large}
              color={theme.colors.basic}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.fontSizeBars}>
          {Array.from({ length: 6 }).map((_, i) => {
            const barStyle = {
              width: theme.iconSize.small,
              height: theme.iconSize.small * (0.5 + i * 0.25),
              marginHorizontal: theme.spacing.small / 2,
              backgroundColor: i < fontSizeLevel ? theme.colors.accent : 'transparent',
              borderColor: theme.colors.basic,
              borderWidth: theme.borderWidth.xsmall,
              borderRadius: theme.borderRadius / 2,
            };
            if (blinkIndex === i) {
              return <Animated.View key={i} style={[barStyle, { opacity: blinkAnim }]} />;
            }
            return <View key={i} style={barStyle} />;
          })}
        </View>
        <View style={styles.fontSizeSide}>
          <TouchableOpacity onPress={increaseFontSize} activeOpacity={1}>
            <Ionicons
              name='add'
              size={theme.iconSize.large}
              color={theme.colors.basic}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  saveIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  accentLabel: {
    marginTop: 4,
  },
  fontSizeLabel: {
    marginTop: 4,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fontSizeSide: {
    flex: 1,
    alignItems: 'center',
  },
  fontSizeBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  themeList: {
    marginBottom: 4,
  },
});
