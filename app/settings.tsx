import 'react-native-gesture-handler';
import 'react-native-reanimated';
import SaveIcon from '@/components/ui/atoms/save-icon';
import { sections, SectionKey } from '@/settings/sections.config';
import { fonts } from '@/constants/Fonts';
import useHeaderShadow from '@/hooks/useHeaderShadow';
import useBlinkAnimation from '@/hooks/useBlinkAnimation';
import { ThemeContext } from '@/src/theme/ThemeContext';
import { themeList } from '@/theme';
import Overlay from '@/components/ui/atoms/overlay';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import useThemeSaver from '@/hooks/useThemeSaver';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { getBaseFontName, calcFontSizeLevel } from '@/settings/utils/font';
import { clampLevel, resolveOverlayColor } from '@/settings/utils/theme';


export default function Settings() {
  const theme = useTheme();
  const navigation = useNavigation();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const initialFontName = getBaseFontName(theme.fontName);
  const [ selectedFontName, setSelectedFontName ] = useState(initialFontName);
  const [ fontWeight, setFontWeight ] = useState<DefaultTheme['fontWeight']>(theme.fontWeight);
  const [ fontSizeLevel, setFontSizeLevel ] = useState(3);
  const [ fontSizeBlinkIndex, setFontSizeBlinkIndex ] = useState<number | null>(null);
  const {
    blinkAnim: fontSizeBlinkAnim,
    triggerBlink: triggerFontBlink,
    stopBlink: stopFontBlink,
  } = useBlinkAnimation({ onEnd: () => setFontSizeBlinkIndex(null) });
  const { blinkAnim: fontWeightBlinkAnim, triggerBlink: triggerWeightBlink, stopBlink: stopWeightBlink } = useBlinkAnimation();
  const [ noteTextAlign, setNoteTextAlign ] = useState<DefaultTheme['noteTextAlign']>(theme.noteTextAlign);
  const triggerBlink = useCallback((index: number) => {
    setFontSizeBlinkIndex(index);
    triggerFontBlink();
  }, [triggerFontBlink]);
  const stopBlink = stopFontBlink;
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const {
    saveAndApply,
    runWithOverlay,
    showSaveIcon,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
    saveWithFeedbackRef,
  } = useThemeSaver({
    selectedThemeName,
    selectedAccentColor,
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
    setTheme,
  });
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: theme.colors.background },
      headerTintColor: theme.colors.basic,
      headerTitleStyle: {
        color: theme.colors.basic,
        fontFamily: theme.fontName,
        fontWeight: theme.fontWeight, // ← берём из темы
        fontSize: theme.fontSize.large,
      },
      headerRight: () => <SaveIcon fadeAnim={fadeAnim} />, 
    });
  }, [navigation, fadeAnim, theme]);

  useFocusEffect(
    useCallback(() => {
      setSelectedThemeName(theme.name);
      setSelectedAccentColor(theme.colors.accent);
      const baseName = getBaseFontName(theme.fontName);
      setSelectedFontName(baseName);
      setFontWeight(theme.fontWeight);
      const fontInfo = fonts.find(f => f.name === baseName) ?? fonts[0];
      const level = calcFontSizeLevel(theme.fontSize.small, fontInfo.defaultSize);
      setFontSizeLevel(level);
      setNoteTextAlign(theme.noteTextAlign);
    }, [theme.name, theme.fontSize.small, theme.fontName, theme.fontWeight, theme.noteTextAlign])
  );
  const skipFontChangeRef = useRef(false);

  const handleAccentChange = useCallback((next: string) => {
    setSelectedAccentColor(next);
    // затемнение + один вызов setTheme внутри saveAndApply
    runWithOverlay(() => {
      saveAndApply({ accentColor: next }); // setTheme(buildTheme(...)) вызовется один раз
    }, /* overlay color*/ theme.colors.background);
  }, [runWithOverlay, saveAndApply, selectedAccentColor, theme.colors.background]);

  const handleFontSelect = useCallback((name: string) => {
    const font = fonts.find(f => f.name === name) ?? fonts[0];
    const weight = font.defaultWeight as DefaultTheme['fontWeight'];
    runWithOverlay(() => {
      skipFontChangeRef.current = true;
      setSelectedFontName(name);
      setFontWeight(weight);
      saveAndApply({ fontName: name, fontWeight: weight });
    });
  }, [runWithOverlay, saveAndApply]);

  const applyFontSizeLevel = (level: number) => {
    const next = clampLevel(level);
    runWithOverlay(() => {
      setFontSizeLevel(next);
      saveAndApply({ fontSizeLevel: next });
    });
  };

  const decreaseFontSize = () => {
    if (fontSizeBlinkIndex !== null) stopBlink();
    if (fontSizeLevel <= 1) {
      triggerBlink(0);
      return;
    }
    applyFontSizeLevel(fontSizeLevel - 1);
  };

  const increaseFontSize = () => {
    if (fontSizeBlinkIndex !== null) stopBlink();
    if (fontSizeLevel >= 5) {
      triggerBlink(4);
      return;
    }
    applyFontSizeLevel(fontSizeLevel + 1);
  };

  const decreaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
      const idx = font.weights.indexOf(fontWeight as string);
    stopWeightBlink();
    if (idx > 0) {
      setFontWeight(font.weights[idx - 1] as DefaultTheme['fontWeight']);
    } else {
      triggerWeightBlink();
    }
  };

  const increaseFontWeight = () => {
    const font = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
      const idx = font.weights.indexOf(fontWeight as string);
    stopWeightBlink();
    if (idx < font.weights.length - 1) {
      setFontWeight(font.weights[idx + 1] as DefaultTheme['fontWeight']);
    } else {
      triggerWeightBlink();
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
    if (skipFontChangeRef.current) {
      skipFontChangeRef.current = false;
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
      ? resolveOverlayColor(selectedThemeName, themeList)
      : undefined;
    saveWithFeedbackRef.current(isFontChange || isWeightChange || isThemeChange, newOverlayColor);
  }, [selectedThemeName, selectedFontName, fontWeight]);

  const selectedFont = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
  const hasMultiple = selectedFont.weights.length > 1;

  const sectionProps: Record<SectionKey, Record<string, unknown>> = {
    theme: {
      selectedThemeName,
      onSelectTheme: setSelectedThemeName,
    },
    accent: {
      selectedAccentColor,
      onSelectAccent: handleAccentChange,
    },
    divider: {},
    font: {
      selectedFontName,
      onSelectFont: handleFontSelect,
      onSelectWeight: () => {},
      fontSizeLevel,
    },
    fontSize: {
      fontSizeLevel,
      onIncrease: increaseFontSize,
      onDecrease: decreaseFontSize,
      blinkIndex: fontSizeBlinkIndex,
      blinkAnim: fontSizeBlinkAnim,
    },
    fontWeight: {
      fontWeight,
      onIncrease: increaseFontWeight,
      onDecrease: decreaseFontWeight,
      blinkAnim: fontWeightBlinkAnim,
      disabled: !hasMultiple,
    },
    align: {
      noteTextAlign,
      onChange: (align: DefaultTheme['noteTextAlign']) => {
        setNoteTextAlign(align);
        saveAndApply({ noteTextAlign: align });
        showSaveIcon();
      },
    },
    preview: {
      noteTextAlign,
      fontName: theme.fontName,
      colors: theme.colors,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {sections.map(({ key, Component }) => (
          <Component key={key} {...sectionProps[key]} />
        ))}
      </ScrollView>

      <Overlay
        visible={overlayVisible}
        color={overlayColor}
        blocks={overlayBlocks}
        anim={overlayAnim}
      />
    </View>
  );
}

const createStyles = (theme: DefaultTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: theme.padding.xlarge,
      paddingBottom: theme.padding.xlarge,
    },
    label: {
      marginBottom: theme.margin.medium,
    },
    section: {
      marginBottom: theme.margin.medium,
    }
  });
