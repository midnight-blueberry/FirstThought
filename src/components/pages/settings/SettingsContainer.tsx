import { SaveIcon } from '@components/ui/atoms';
import { fonts } from '@constants/Fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import { ThemeContext } from '@store/ThemeContext';
import { themeList } from '@constants/theme';
import useThemeSaver from '@hooks/useThemeSaver';
import useSyncThemeToLocalState from '@hooks/useSyncThemeToLocalState';
import useFontControls from '@hooks/useFontControls';
import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react';
import useHeaderTitleSync from '@hooks/useHeaderTitleSync';
import { DefaultTheme } from 'styled-components/native';
import useTheme from '@hooks/useTheme';
import { getBaseFontName, calcFontSizeLevel } from '@utils/font';
import { getFontByName, hasMultipleWeights } from '@utils/fontHelpers';
import { clampLevel, resolveOverlayColor } from '@utils/theme';
import type { SectionPropsMap } from '@settings/SectionPropsMap';
import SettingsContent from './SettingsContent';


export default function SettingsContainer() {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const initialFontName = getBaseFontName(theme.fontName);
  const initialFontInfo = getFontByName(fonts, initialFontName);
  const initialFontSizeLevel = calcFontSizeLevel(theme.fontSize.small, initialFontInfo.defaultSize);

  const {
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    selectFont,
    bumpFontWeight,
    bumpFontSize,
    blinkState,
  } = useFontControls({
    fonts,
    initial: {
      fontName: initialFontName,
      fontWeight: theme.fontWeight,
      fontSizeLevel: initialFontSizeLevel,
    },
    clampLevel,
    maxLevel: 5,
    minLevel: 1,
  });
  const [ noteTextAlign, setNoteTextAlign ] = useState<DefaultTheme['noteTextAlign']>(theme.noteTextAlign);
  if (!context) throw new Error('ThemeContext is missing');

  const { setTheme } = context;
  const {
    saveAndApply,
    runWithOverlay,
    fadeAnim,
    overlayAnim,
    overlayVisible,
    overlayColor,
    overlayBlocks,
  } = useThemeSaver({
    selectedThemeName,
    selectedAccentColor,
    selectedFontName,
    fontWeight,
    fontSizeLevel,
    noteTextAlign,
    setTheme,
  });

  const [prevFont, setPrevFont] = useState({ name: selectedFontName, weight: fontWeight });
  useEffect(() => {
    if (prevFont.name !== selectedFontName || prevFont.weight !== fontWeight) {
      runWithOverlay(() => {
        saveAndApply({ fontName: selectedFontName, fontWeight });
      });
      setPrevFont({ name: selectedFontName, weight: fontWeight });
    }
  }, [selectedFontName, fontWeight, runWithOverlay, saveAndApply, prevFont]);

  const [prevFontSize, setPrevFontSize] = useState(fontSizeLevel);
  useEffect(() => {
    if (prevFontSize !== fontSizeLevel) {
      runWithOverlay(() => {
        saveAndApply({ fontSizeLevel });
      });
      setPrevFontSize(fontSizeLevel);
    }
  }, [fontSizeLevel, runWithOverlay, saveAndApply, prevFontSize]);

  useHeaderTitleSync(theme, () => <SaveIcon fadeAnim={fadeAnim} />);

  useSyncThemeToLocalState(theme, {
    setSelectedThemeName,
    setSelectedAccentColor,
    setNoteTextAlign,
  });

  const handleAccentChange = useCallback((next: string) => {
    runWithOverlay(() => {
      setSelectedAccentColor(next);
      saveAndApply({ accentColor: next });
    }, theme.colors.background);
  }, [runWithOverlay, saveAndApply, theme.colors.background]);

  const handleThemeChange = useCallback((name: string) => {
    const overlayColor = resolveOverlayColor(name, themeList);
    runWithOverlay(() => {
      setSelectedThemeName(name);
      saveAndApply({ themeName: name });
    }, overlayColor);
  }, [runWithOverlay, saveAndApply]);

  const selectedFont = getFontByName(fonts, selectedFontName);
  const hasMultiple = hasMultipleWeights(selectedFont);

  const noopSelectWeight = useCallback(() => {}, []);
  const handleIncreaseFontSize = useCallback(() => bumpFontSize(1), [bumpFontSize]);
  const handleDecreaseFontSize = useCallback(() => bumpFontSize(-1), [bumpFontSize]);
  const handleIncreaseFontWeight = useCallback(() => bumpFontWeight(1), [bumpFontWeight]);
  const handleDecreaseFontWeight = useCallback(() => bumpFontWeight(-1), [bumpFontWeight]);
  const handleAlignChange = useCallback(
    (align: DefaultTheme['noteTextAlign']) => {
      runWithOverlay(() => {
        setNoteTextAlign(align);
        saveAndApply({ noteTextAlign: align });
      });
    },
    [runWithOverlay, saveAndApply],
  );

  const sectionProps: SectionPropsMap = useMemo(
    () => ({
      theme: {
        selectedThemeName,
        onSelectTheme: handleThemeChange,
      },
      accent: {
        selectedAccentColor,
        onSelectAccent: handleAccentChange,
      },
      divider: {},
      font: {
        selectedFontName,
        onSelectFont: selectFont,
        onSelectWeight: noopSelectWeight,
        fontSizeLevel,
      },
      fontSize: {
        fontSizeLevel,
        onIncrease: handleIncreaseFontSize,
        onDecrease: handleDecreaseFontSize,
        blinkIndex: blinkState.size.index,
        blinkAnim: blinkState.size.anim,
      },
      fontWeight: {
        fontWeight,
        onIncrease: handleIncreaseFontWeight,
        onDecrease: handleDecreaseFontWeight,
        blinkAnim: blinkState.weight.anim,
        disabled: !hasMultiple,
      },
      align: {
        noteTextAlign,
        onChange: handleAlignChange,
      },
      preview: {
        noteTextAlign,
        fontName: theme.fontName,
        colors: theme.colors,
      },
    }),
    [
      selectedThemeName,
      handleThemeChange,
      selectedAccentColor,
      handleAccentChange,
      selectedFontName,
      selectFont,
      noopSelectWeight,
      fontSizeLevel,
      handleIncreaseFontSize,
      handleDecreaseFontSize,
      blinkState.size.index,
      blinkState.size.anim,
      fontWeight,
      handleIncreaseFontWeight,
      handleDecreaseFontWeight,
      blinkState.weight.anim,
      hasMultiple,
      noteTextAlign,
      handleAlignChange,
      theme.fontName,
      theme.colors,
    ],
  );

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
