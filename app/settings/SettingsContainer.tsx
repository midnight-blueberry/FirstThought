import 'react-native-gesture-handler';
import 'react-native-reanimated';
import SaveIcon from '@/components/ui/atoms/save-icon';
import { SectionKey } from '@/settings/sections.config';
import { fonts } from '@/constants/Fonts';
import useHeaderShadow from '@/hooks/useHeaderShadow';
import { ThemeContext } from '@/src/theme/ThemeContext';
import { themeList } from '@/theme';
import useThemeSaver from '@/hooks/useThemeSaver';
import useSyncThemeToLocalState from '@/src/settings/hooks/useSyncThemeToLocalState';
import useFontControls from '@/src/settings/hooks/useFontControls';
import React, { useCallback, useContext, useRef, useState } from 'react';
import useHeaderTitleSync from '@/hooks/useHeaderTitleSync';
import { DefaultTheme, useTheme } from 'styled-components/native';
import { getBaseFontName, calcFontSizeLevel } from '@/settings/utils/font';
import { clampLevel, resolveOverlayColor } from '@/settings/utils/theme';
import type { SavedSettingsPatch } from '@/settings/types';
import SettingsContent from './SettingsContent';


export default function SettingsContainer() {
  const theme = useTheme();
  const handleScroll = useHeaderShadow();
  const context = useContext(ThemeContext);
  const [ selectedThemeName, setSelectedThemeName ] = useState(theme.name);
  const [ selectedAccentColor, setSelectedAccentColor ] = useState(theme.colors.accent);
  const saveAndApplyRef = useRef<(patch: SavedSettingsPatch) => void>(() => {});
  const runWithOverlayRef = useRef<(action: () => void, color?: string) => void>(() => {});
  const initialFontName = getBaseFontName(theme.fontName);
  const initialFontInfo = fonts.find(f => f.name === initialFontName) ?? fonts[0];
  const initialFontSizeLevel = calcFontSizeLevel(theme.fontSize.small, initialFontInfo.defaultSize);
  const saveAndApplyCb = useCallback(
    (patch: SavedSettingsPatch) => {
      saveAndApplyRef.current(patch);
    },
    [],
  );

  const runWithOverlayCb = useCallback(
    (action: () => void, color?: string) => {
      runWithOverlayRef.current(action, color);
    },
    [],
  );

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
    saveAndApply: saveAndApplyCb,
    runWithOverlay: runWithOverlayCb,
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

  saveAndApplyRef.current = saveAndApply;
  runWithOverlayRef.current = runWithOverlay;

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

  const selectedFont = fonts.find(f => f.name === selectedFontName) ?? fonts[0];
  const hasMultiple = selectedFont.weights.length > 1;

  const sectionProps: Record<SectionKey, Record<string, unknown>> = {
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
      onSelectWeight: () => {},
      fontSizeLevel,
    },
    fontSize: {
      fontSizeLevel,
      onIncrease: () => bumpFontSize(1),
      onDecrease: () => bumpFontSize(-1),
      blinkIndex: blinkState.size.index,
      blinkAnim: blinkState.size.anim,
    },
    fontWeight: {
      fontWeight,
      onIncrease: () => bumpFontWeight(1),
      onDecrease: () => bumpFontWeight(-1),
      blinkAnim: blinkState.weight.anim,
      disabled: !hasMultiple,
    },
    align: {
      noteTextAlign,
      onChange: (align: DefaultTheme['noteTextAlign']) => {
        runWithOverlay(() => {
          setNoteTextAlign(align);
          saveAndApply({ noteTextAlign: align });
        });
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
