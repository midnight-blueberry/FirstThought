import React,{useContext,useEffect,useMemo,useState} from 'react';
import {SaveIcon} from '@components/ui/atoms';
import {fonts} from '@constants/Fonts';
import useHeaderShadow from '@hooks/useHeaderShadow';
import {ThemeContext} from '@store/ThemeContext';
import useThemeSaver from '@hooks/useThemeSaver';
import useSyncThemeToLocalState from '@hooks/useSyncThemeToLocalState';
import useFontControls from '@hooks/useFontControls';
import useHeaderTitleSync from '@hooks/useHeaderTitleSync';
import useTheme from '@hooks/useTheme';
import {getBaseFontName,calcFontSizeLevel} from '@utils/font';
import {getFontByName} from '@utils/fontHelpers';
import {clampLevel} from '@utils/theme';
import useSettingsHandlers from './hooks/useSettingsHandlers';
import buildSectionProps from './buildSectionProps';
import type {SettingsVm} from './useSettingsVm.types';

export default function useSettingsVm():SettingsVm{
  const theme=useTheme();const handleScroll=useHeaderShadow();const context=useContext(ThemeContext);
  const [selectedThemeName,setSelectedThemeName]=useState(theme.name);
  const [selectedAccentColor,setSelectedAccentColor]=useState(theme.colors.accent);
  const initialFontName=getBaseFontName(theme.fontName);const initialFontInfo=getFontByName(fonts,initialFontName);
  const initialFontSizeLevel=calcFontSizeLevel(theme.fontSize.small,initialFontInfo.defaultSize);
  const {selectedFontName,fontWeight,fontSizeLevel,selectFont,bumpFontWeight,bumpFontSize,blinkState}=useFontControls({fonts,initial:{fontName:initialFontName,fontWeight:theme.fontWeight,fontSizeLevel:initialFontSizeLevel},clampLevel,maxLevel:5,minLevel:1});
  const [noteTextAlign,setNoteTextAlign]=useState(theme.noteTextAlign);if(!context)throw new Error('ThemeContext is missing');
  const {setTheme}=context;
  const {saveAndApply,runWithOverlay,fadeAnim,overlayAnim,overlayVisible,overlayColor,overlayBlocks}=useThemeSaver({selectedThemeName,selectedAccentColor,selectedFontName,fontWeight,fontSizeLevel,noteTextAlign,setTheme});
  const [prevFont,setPrevFont]=useState({name:selectedFontName,weight:fontWeight});const [prevFontSize,setPrevFontSize]=useState(fontSizeLevel);
  useEffect(()=>{if(prevFont.name!==selectedFontName||prevFont.weight!==fontWeight){runWithOverlay(()=>saveAndApply({fontName:selectedFontName,fontWeight}));setPrevFont({name:selectedFontName,weight:fontWeight});}if(prevFontSize!==fontSizeLevel){runWithOverlay(()=>saveAndApply({fontSizeLevel}));setPrevFontSize(fontSizeLevel);}},[selectedFontName,fontWeight,fontSizeLevel,runWithOverlay,saveAndApply,prevFont,prevFontSize]);
  useHeaderTitleSync(theme,()=> <SaveIcon fadeAnim={fadeAnim}/>);
  useSyncThemeToLocalState(theme,{setSelectedThemeName,setSelectedAccentColor,setNoteTextAlign});
  const handlers=useSettingsHandlers({runWithOverlay,saveAndApply,bumpFontSize,bumpFontWeight,setSelectedAccentColor,setSelectedThemeName,setNoteTextAlign,themeBg:theme.colors.background});
  const sectionProps=useMemo(()=>({...buildSectionProps({selectedThemeName,selectedAccentColor,selectedFontName,fontSizeLevel,fontWeight,noteTextAlign,sizeBlinkIndex:blinkState.size.index,sizeBlinkAnim:blinkState.size.anim,weightBlinkAnim:blinkState.weight.anim,onSelectFont:selectFont,...handlers}),preview:{noteTextAlign,fontName:theme.fontName,colors:theme.colors}}),[selectedThemeName,selectedAccentColor,selectedFontName,fontSizeLevel,fontWeight,noteTextAlign,blinkState.size.index,blinkState.size.anim,blinkState.weight.anim,handlers,selectFont,theme.fontName,theme.colors]);
  return{sectionProps,theme,handleScroll,overlayVisible,overlayColor,overlayAnim,overlayBlocks};
}

