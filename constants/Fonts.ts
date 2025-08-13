import { DefaultTheme } from 'styled-components/native';

const createFontSize = (medium: number): DefaultTheme['fontSize'] => ({
  small: medium - 4,
  medium,
  large: medium + 4,
  xlarge: medium + 8,
});

export const fonts = {
  'Comfortaa': {
    file: require('@/assets/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf'),
    fontSize: createFontSize(18),
  },
  'Bad Script': {
    file: require('@/assets/fonts/Bad_Script/BadScript-Regular.ttf'),
    fontSize: createFontSize(22),
  },
  'Lora': {
    file: require('@/assets/fonts/Lora/Lora-VariableFont_wght.ttf'),
    fontSize: createFontSize(20),
  },
  'Montserrat': {
    file: require('@/assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf'),
    fontSize: createFontSize(20),
  },
  'Nata Sans': {
    file: require('@/assets/fonts/Nata_Sans/NataSans-VariableFont_wght.ttf'),
    fontSize: createFontSize(18),
  },
  'PT Sans': {
    file: require('@/assets/fonts/PT_Sans/PTSans-Regular.ttf'),
    fontSize: createFontSize(18),
  },
  'Raleway': {
    file: require('@/assets/fonts/Raleway/Raleway-VariableFont_wght.ttf'),
    fontSize: createFontSize(20),
  },
  'Roboto Condensed': {
    file: require('@/assets/fonts/Roboto_Condensed/RobotoCondensed-VariableFont_wght.ttf'),
    fontSize: createFontSize(18),
  },
  'Roboto Slab': {
    file: require('@/assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf'),
    fontSize: createFontSize(20),
  },
} as const;

export type FontName = keyof typeof fonts;
export const fontNames = Object.keys(fonts) as FontName[];
export const defaultFontName: FontName = 'Comfortaa';
