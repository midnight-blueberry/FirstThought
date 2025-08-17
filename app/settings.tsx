import AppText from '@/components/ui/atoms/app-text';
import Header from '@/components/ui/organisms/header';
import SelectableRow from '@/components/ui/molecules/selectable-row';
import FontSizeSelector from '@/components/ui/organisms/font-size-selector';
import FontWeightSelector from '@/components/ui/organisms/font-weight-selector';
import IconButton from '@/components/ui/atoms/icon-button';
import { ThemeContext } from '@/src/theme/ThemeContext';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme, DefaultTheme } from 'styled-components/native';
import { themeList } from '@/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { accentColors } from '@/constants/AccentColors';
import { fonts, getFontFamily } from '@/constants/Fonts';
import { saveSettings } from '@/src/storage/settings';

const interpolateColor = (from: string, to: string, t: number) => {
  const f = parseInt(from.slice(1), 16);
  const tVal = parseInt(to.slice(1), 16);

  const r1 = (f >> 16) & 0xff;
  const g1 = (f >> 8) & 0xff;
  const b1 = f & 0xff;

  const r2 = (tVal >> 16) & 0xff;
  const g2 = (tVal >> 8) & 0xff;
  const b2 = tVal & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export default function Settings() {
  const theme = useTheme();
  const context = useContext(ThemeContext);
  const [showShadow, setShowShadow] = useState(false);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const initialFontName = theme.fontName.replace(/_\d+$/, '').replace(/_/g, ' ');
  const [ selectedFontName, setSelectedFontName ] = useState(initialFontName);
  const [ fontWeight, setFontWeight ] = useState(theme.fontWeight);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ blinkIndex, setBlinkIndex ] = useState<number | null>(null);
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [ weightBlinkIndex, setWeightBlinkIndex ] = useState<number | null>(null);
  const weightBlinkAnim = useRef(new Animated.Value(1)).current;
  const [ isSaved, setIsSaved ] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const accentAnim = useRef(new Animated.Value(0)).current;
  const [ overlayVisible, setOverlayVisible ] = useState(false);
  const [ overlayColor, setOverlayColor ] = useState(theme.colors.background);
  const overlayAnim = useRef(new Animated.Value(0)).current;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      const baseName = theme.fontName.replace(/_\d+$/, '').replace(/_/g, ' ');
      setSelectedFontName(baseName);
      setFontWeight(theme.fontWeight);
      const fontInfo = fonts.find(f => f.name === baseName) ?? fonts[0];
      const base = fontInfo.defaultSize - 4;
      const level = Math.round((theme.fontSize.small - base) / 2) + 3;
      setFontSizeLevel(level);
    }, [theme.name, theme.fontSize.small, theme.fontName, theme.fontWeight])
  );

  const updateTheme = useCallback(
    (themeName: string, accentColor: string, fontName: string, weight: string, level: number) => {
      const chosenTheme = themeList.find(t => t.name === themeName);
      const chosenFont = fonts.find(f => f.name === fontName) ?? fonts[0];
      if (chosenTheme) {
        const updatedColors = {
          ...chosenTheme.colors,
          accent: accentColor,
        };
        if (chosenTheme.colors.basic === chosenTheme.colors.accent) {
          updatedColors.basic = accentColor;
        }
        const delta = (level - 3) * 2;
        const medium = chosenFont.defaultSize + delta;
        const updatedFontSize = {
          small: medium - 4,
          medium,
          large: medium + 4,
          xlarge: medium + 8,
        } as DefaultTheme['fontSize'];
        const w = chosenFont.weights.includes(weight) ? weight : chosenFont.defaultWeight;
        setTheme({
          ...chosenTheme,
          colors: updatedColors,
          fontSize: updatedFontSize,
          fontName: getFontFamily(chosenFont.family, w),
          fontWeight: w,
        });
      }
    },
    [setTheme]
  );

  const showSaveIcon = useCallback(() => {
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
  }, [fadeAnim]);

  const hideSaveIcon = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    fadeAnim.stopAnimation();
    setIsSaved(false);
  }, [fadeAnim]);

  const runWithOverlay = useCallback((action: () => void, color?: string) => {
    setOverlayColor(color ?? theme.colors.background);
    setOverlayVisible(true);
    overlayAnim.stopAnimation();
    overlayAnim.setValue(0);
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      hideSaveIcon();
      action();
      setTimeout(() => {
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start(() => {
          setOverlayVisible(false);
          showSaveIcon();
        });
      }, 100);
    });
  }, [overlayAnim, hideSaveIcon, showSaveIcon, theme.colors.background]);

  const saveWithFeedback = useCallback((withOverlay: boolean, color?: string) => {
    const performSave = () => {
        updateTheme(selectedThemeName, selectedAccentColor, selectedFontName, fontWeight, fontSizeLevel);
        void saveSettings({
          themeName: selectedThemeName,
          accentColor: selectedAccentColor,
          fontSizeLevel,
          fontName: selectedFontName,
          fontWeight,
        });
    };

    if (withOverlay) {
      runWithOverlay(performSave, color);
    } else {
      performSave();
      showSaveIcon();
    }
  }, [runWithOverlay, selectedThemeName, selectedAccentColor, selectedFontName, fontSizeLevel, fontWeight, updateTheme, showSaveIcon]);

  const saveWithFeedbackRef = useRef<(withOverlay: boolean, color?: string) => void>(saveWithFeedback);
  useEffect(() => {
    saveWithFeedbackRef.current = saveWithFeedback;
  }, [saveWithFeedback]);

  const handleAccentChange = useCallback(
    (color: string) => {
      const from = selectedAccentColor;
      setSelectedAccentColor(color);
      accentAnim.stopAnimation();
      accentAnim.setValue(0);
        const id = accentAnim.addListener(({ value }) => {
          const c = interpolateColor(from, color, value);
          updateTheme(selectedThemeName, c, selectedFontName, fontWeight, fontSizeLevel);
        });
      Animated.timing(accentAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        accentAnim.removeListener(id);
        saveWithFeedbackRef.current(false);
      });
    },
    [accentAnim, selectedAccentColor, selectedThemeName, selectedFontName, fontWeight, fontSizeLevel, updateTheme]
  );

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

  const applyFontSizeLevel = (level: number) => {
    runWithOverlay(() => {
      setFontSizeLevel(level);
      updateTheme(selectedThemeName, selectedAccentColor, selectedFontName, fontWeight, level);
      void saveSettings({ themeName: selectedThemeName, accentColor: selectedAccentColor, fontSizeLevel: level, fontName: selectedFontName, fontWeight });
    });
  };

  const decreaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    if (fontSizeLevel <= 1) {
      triggerBlink(0);
      return;
    }
    applyFontSizeLevel(fontSizeLevel - 1);
  };

  const increaseFontSize = () => {
    if (blinkIndex !== null) stopBlink();
    if (fontSizeLevel >= 6) {
      triggerBlink(5);
      return;
    }
    applyFontSizeLevel(fontSizeLevel + 1);
  };

  const triggerWeightBlink = useCallback((index: number) => {
    weightBlinkAnim.stopAnimation();
    setWeightBlinkIndex(index);
    weightBlinkAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(weightBlinkAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(weightBlinkAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]),
      { iterations: 5 }
    ).start(() => setWeightBlinkIndex(null));
  }, [weightBlinkAnim]);

  const stopWeightBlink = useCallback(() => {
    weightBlinkAnim.stopAnimation();
    weightBlinkAnim.setValue(1);
    setWeightBlinkIndex(null);
  }, [weightBlinkAnim]);

  const decreaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
    const idx = font.weights.indexOf(fontWeight);
    if (weightBlinkIndex !== null) stopWeightBlink();
    if (idx > 0) {
      setFontWeight(font.weights[idx - 1]);
    } else {
      triggerWeightBlink(0);
    }
  };

  const increaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
    const idx = font.weights.indexOf(fontWeight);
    if (weightBlinkIndex !== null) stopWeightBlink();
    if (idx < font.weights.length - 1) {
      setFontWeight(font.weights[idx + 1]);
    } else {
      triggerWeightBlink(font.weights.length - 1);
    }
  };

  const isInitialRender = useRef(true);
  const prevFontNameRef = useRef(selectedFontName);
  const prevFontWeightRef = useRef(fontWeight);
  const prevThemeNameRef = useRef(selectedThemeName);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevFontNameRef.current = selectedFontName;
      prevFontWeightRef.current = fontWeight;
      prevThemeNameRef.current = selectedThemeName;
      return;
    }
    const isFontChange = prevFontNameRef.current !== selectedFontName;
    const isWeightChange = prevFontWeightRef.current !== fontWeight;
    const isThemeChange = prevThemeNameRef.current !== selectedThemeName;
    prevFontNameRef.current = selectedFontName;
    prevFontWeightRef.current = fontWeight;
    prevThemeNameRef.current = selectedThemeName;
    const newOverlayColor = isThemeChange
      ? themeList.find(t => t.name === selectedThemeName)?.colors.background
      : undefined;
    saveWithFeedbackRef.current(isFontChange || isWeightChange || isThemeChange, newOverlayColor);
  }, [selectedThemeName, selectedFontName, fontWeight]);

  const selectedFont = fonts.find(f => f.name === selectedFontName) ?? fonts[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header showShadow={showShadow}>
        <IconButton
          icon="chevron-back"
          onPress={() => navigation.goBack()}
          size={theme.iconSize.xlarge}
        />
        <AppText variant="large">Настройки</AppText>
        <Animated.View
          pointerEvents="none"
          style={{ opacity: isSaved ? fadeAnim : 0 }}
        >
          <IconButton icon="save-outline" size={theme.iconSize.large} />
        </Animated.View>
      </Header>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={(e) => setShowShadow(e.nativeEvent.contentOffset.y > 0)}
        scrollEventThrottle={16}
      >
        <AppText variant='large' style={[styles.label, styles.themeLabel]}>Тема</AppText>
        <View style={styles.themeList}>
          {themeList.map(themeItem => (
            <SelectableRow
              key={themeItem.name}
              label={themeItem.name}
              swatchColor={themeItem.colors.background}
              selected={themeItem.name === selectedThemeName}
              onPress={() => setSelectedThemeName(themeItem.name)}
            />
          ))}
        </View>

        <AppText variant='large' style={[styles.label, styles.accentLabel]}>Акцент</AppText>
        <View style={styles.themeList}>
          {accentColors.map(color => (
            <SelectableRow
              key={color.hex}
              label={color.name}
              swatchColor={color.hex}
              selected={color.hex === selectedAccentColor}
              onPress={() => handleAccentChange(color.hex)}
            />
          ))}
        </View>

        <AppText variant='large' style={[styles.label, styles.fontLabel]}>Шрифт</AppText>
        <View style={styles.themeList}>
          {fonts.map(f => {
            const delta = (fontSizeLevel - 3) * 2;
            const medium = f.defaultSize + delta;
            return (
              <SelectableRow
                key={f.name}
                label={f.name}
                swatchColor={theme.colors.basic}
                selected={f.name === selectedFontName}
                onPress={() => { setSelectedFontName(f.name); setFontWeight(f.defaultWeight); }}
                fontFamily={getFontFamily(f.family, f.defaultWeight)}
                fontWeight='normal'
                fontSize={medium}
              />
            );
          })}
        </View>

        <FontSizeSelector
          level={fontSizeLevel}
          onIncrease={increaseFontSize}
          onDecrease={decreaseFontSize}
          blinkIndex={blinkIndex}
          blinkAnim={blinkAnim}
        />
        <FontWeightSelector
          weights={selectedFont.weights}
          selectedIndex={selectedFont.weights.indexOf(fontWeight)}
          onIncrease={increaseFontWeight}
          onDecrease={decreaseFontWeight}
          blinkIndex={weightBlinkIndex}
          blinkAnim={weightBlinkAnim}
        />
      </ScrollView>
      {overlayVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            backgroundColor: overlayColor,
            opacity: overlayAnim,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  themeLabel: {
    marginTop: 8,
  },
  accentLabel: {
    marginTop: 4,
  },
  fontLabel: {
    marginTop: 4,
  },
  themeList: {
    marginBottom: 4,
  },
});
