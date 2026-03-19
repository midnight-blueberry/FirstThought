import { useCallback } from 'react';
import type { FontWeight } from '@/constants/fonts';
import type { ThemeName } from '@theme/buildTheme';
import type { Settings } from '@/state/SettingsContext';

export type SettingsHandlers = {
  onSelectTheme: (name: ThemeName) => void;
  onSelectAccent: (color: string) => void;
  onSelectFontFamily: (name: string) => void;
  onChangeFontWeight: (w: FontWeight) => void;
  onChangeFontSizeLevel: (lvl: number) => void;
  onSelectNoteFontFamily: (name: string) => void;
  onChangeNoteFontWeight: (w: FontWeight) => void;
  onChangeNoteFontSizeLevel: (lvl: number) => void;
  onChangeNoteTextAlign: (align: Settings['noteTextAlign']) => void;
};

export function useSettingsHandlers(deps: {
  setSelectedThemeName: (v: ThemeName) => void;
  setSelectedAccentColor: (v: string) => void;
  setSelectedFontName: (v: string) => void;
  setFontWeightState: (v: FontWeight) => void;
  setFontSizeLevel: (v: number) => void;
  setNoteFontName?: (v: string) => void;
  setNoteFontWeightState?: (v: FontWeight) => void;
  setNoteFontSizeLevel?: (v: number) => void;
  setNoteTextAlign: (v: Settings['noteTextAlign']) => void;
  setSettingsVersion?: (updater: (x: number) => number) => void;
}): SettingsHandlers {
  const {
    setSelectedThemeName,
    setSelectedAccentColor,
    setSelectedFontName,
    setFontWeightState,
    setFontSizeLevel,
    setNoteFontName,
    setNoteFontWeightState,
    setNoteFontSizeLevel,
    setNoteTextAlign,
    setSettingsVersion,
  } = deps;

  const incVersion = useCallback(() => {
    setSettingsVersion?.((x) => x + 1);
  }, [setSettingsVersion]);

  const onSelectTheme = useCallback(
    (name: ThemeName) => {
      setSelectedThemeName(name);
      incVersion();
    },
    [incVersion, setSelectedThemeName],
  );

  const onSelectAccent = useCallback(
    (color: string) => {
      setSelectedAccentColor(color);
      incVersion();
    },
    [incVersion, setSelectedAccentColor],
  );

  const onSelectFontFamily = useCallback(
    (name: string) => {
      setSelectedFontName(name);
      incVersion();
    },
    [incVersion, setSelectedFontName],
  );

  const onChangeFontWeight = useCallback(
    (w: FontWeight) => {
      setFontWeightState(w);
      incVersion();
    },
    [incVersion, setFontWeightState],
  );

  const onChangeFontSizeLevel = useCallback(
    (lvl: number) => {
      setFontSizeLevel(lvl);
      incVersion();
    },
    [incVersion, setFontSizeLevel],
  );

  const onSelectNoteFontFamily = useCallback(
    (name: string) => {
      setNoteFontName?.(name);
      incVersion();
    },
    [incVersion, setNoteFontName],
  );

  const onChangeNoteFontWeight = useCallback(
    (w: FontWeight) => {
      setNoteFontWeightState?.(w);
      incVersion();
    },
    [incVersion, setNoteFontWeightState],
  );

  const onChangeNoteFontSizeLevel = useCallback(
    (lvl: number) => {
      setNoteFontSizeLevel?.(lvl);
      incVersion();
    },
    [incVersion, setNoteFontSizeLevel],
  );

  const onChangeNoteTextAlign = useCallback(
    (align: Settings['noteTextAlign']) => {
      setNoteTextAlign(align);
      incVersion();
    },
    [incVersion, setNoteTextAlign],
  );

  return {
    onSelectTheme,
    onSelectAccent,
    onSelectFontFamily,
    onChangeFontWeight,
    onChangeFontSizeLevel,
    onSelectNoteFontFamily,
    onChangeNoteFontWeight,
    onChangeNoteFontSizeLevel,
    onChangeNoteTextAlign,
  };
}

