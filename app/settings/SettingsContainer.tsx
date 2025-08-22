import 'react-native-gesture-handler';
import 'react-native-reanimated';
import SaveIcon from '@/components/ui/atoms/save-icon';
import { SectionKey } from '@/settings/sections.config';
import { fonts } from '@/constants/Fonts';
import useHeaderShadow from '@/hooks/useHeaderShadow';
import useBlinkAnimation from '@/hooks/useBlinkAnimation';
import { ThemeContext } from '@/src/theme/ThemeContext';
import { themeList } from '@/theme';
import useThemeSaver from '@/hooks/useThemeSaver';
import useSyncThemeToLocalState from '@/src/settings/hooks/useSyncThemeToLocalState';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useHeaderTitleSync from '@/hooks/useHeaderTitleSync';
import usePrevious from '@/hooks/usePrevious';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { getBaseFontName } from '@/settings/utils/font';
import { clampLevel, resolveOverlayColor } from '@/settings/utils/theme';
import SettingsContent from './SettingsContent';


export default function SettingsContainer() {
  const theme = useTheme();
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

  useHeaderTitleSync(theme, () => <SaveIcon fadeAnim={fadeAnim} />);

  useSyncThemeToLocalState(theme, {
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeight,
    setFontSizeLevel,
    setNoteTextAlign,
  });

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
  const prevFontName = usePrevious(selectedFontName);
  const prevFontWeight = usePrevious(fontWeight);
  const prevThemeName = usePrevious(selectedThemeName);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (skipFontChangeRef.current) {
      skipFontChangeRef.current = false;
      return;
    }
    const isFontChange = prevFontName !== selectedFontName;
    const isWeightChange = prevFontWeight !== fontWeight;
    const isThemeChange = prevThemeName !== selectedThemeName;
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
    <SettingsContent
      sectionProps={sectionProps}
      theme={theme}
      handleScroll={handleScroll}
      overlayVisible={overlayVisible}
      overlayColor={overlayColor}
      overlayAnim={overlayAnim}
      overlayBlocks={overlayBlocks}
    />
  );
}
