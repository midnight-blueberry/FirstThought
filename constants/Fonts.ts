export const fontData = {
  Bad_Script: {
    file: require('@/assets/fonts/Bad_Script/BadScript-Regular.ttf'),
    defaultSize: 22,
  },
  Comfortaa: {
    file: require('@/assets/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf'),
    defaultSize: 18,
  },
  Lora: {
    file: require('@/assets/fonts/Lora/Lora-VariableFont_wght.ttf'),
    defaultSize: 18,
  },
  Montserrat: {
    file: require('@/assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf'),
    defaultSize: 18,
    defaultWeight: '400',
  },
  Nata_Sans: {
    file: require('@/assets/fonts/Nata_Sans/NataSans-VariableFont_wght.ttf'),
    defaultSize: 18,
  },
  PT_Sans: {
    file: require('@/assets/fonts/PT_Sans/PTSans-Regular.ttf'),
    defaultSize: 18,
  },
  Raleway: {
    file: require('@/assets/fonts/Raleway/Raleway-VariableFont_wght.ttf'),
    defaultSize: 18,
    defaultWeight: '400',
  },
  Roboto_Condensed: {
    file: require('@/assets/fonts/Roboto_Condensed/RobotoCondensed-VariableFont_wght.ttf'),
    defaultSize: 18,
  },
  Roboto_Slab: {
    file: require('@/assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf'),
    defaultSize: 18,
  },
} as const;

export const fonts = Object.entries(fontData).map(([folder, info]) => ({
  name: folder.replace(/_/g, ' '),
  file: info.file,
  defaultSize: info.defaultSize,
  defaultWeight: info.defaultWeight ?? 'normal',
}));

export const defaultFontName = 'Comfortaa';
