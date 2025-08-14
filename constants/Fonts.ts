export const fontData = {
  Bad_Script: {
    files: {
      '400': require('@/assets/fonts/Bad_Script/static/BadScript-Regular.ttf'),
    },
    defaultSize: 22,
  },
  Comfortaa: {
    files: {
      '300': require('@/assets/fonts/Comfortaa/static/Comfortaa-Light.ttf'),
      '400': require('@/assets/fonts/Comfortaa/static/Comfortaa-Regular.ttf'),
      '500': require('@/assets/fonts/Comfortaa/static/Comfortaa-Medium.ttf'),
      '600': require('@/assets/fonts/Comfortaa/static/Comfortaa-SemiBold.ttf'),
      '700': require('@/assets/fonts/Comfortaa/static/Comfortaa-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Lora: {
    files: {
      '400': require('@/assets/fonts/Lora/static/Lora-Regular.ttf'),
      '500': require('@/assets/fonts/Lora/static/Lora-Medium.ttf'),
      '600': require('@/assets/fonts/Lora/static/Lora-SemiBold.ttf'),
      '700': require('@/assets/fonts/Lora/static/Lora-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Montserrat: {
    files: {
      '300': require('@/assets/fonts/Montserrat/static/Montserrat-Light.ttf'),
      '400': require('@/assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
      '500': require('@/assets/fonts/Montserrat/static/Montserrat-Medium.ttf'),
      '600': require('@/assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf'),
      '700': require('@/assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Nata_Sans: {
    files: {
      '300': require('@/assets/fonts/Nata_Sans/static/NataSans-Light.ttf'),
      '400': require('@/assets/fonts/Nata_Sans/static/NataSans-Regular.ttf'),
      '500': require('@/assets/fonts/Nata_Sans/static/NataSans-Medium.ttf'),
      '600': require('@/assets/fonts/Nata_Sans/static/NataSans-SemiBold.ttf'),
      '700': require('@/assets/fonts/Nata_Sans/static/NataSans-Bold.ttf'),
    },
    defaultSize: 18,
  },
  PT_Sans: {
    files: {
      '400': require('@/assets/fonts/PT_Sans/static/PTSans-Regular.ttf'),
      '700': require('@/assets/fonts/PT_Sans/static/PTSans-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Raleway: {
    files: {
      '100': require('@/assets/fonts/Raleway/static/Raleway-Thin.ttf'),
      '200': require('@/assets/fonts/Raleway/static/Raleway-ExtraLight.ttf'),
      '300': require('@/assets/fonts/Raleway/static/Raleway-Light.ttf'),
      '400': require('@/assets/fonts/Raleway/static/Raleway-Regular.ttf'),
      '500': require('@/assets/fonts/Raleway/static/Raleway-Medium.ttf'),
      '600': require('@/assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
      '700': require('@/assets/fonts/Raleway/static/Raleway-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Roboto_Condensed: {
    files: {
      '100': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Thin.ttf'),
      '200': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-ExtraLight.ttf'),
      '300': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Light.ttf'),
      '400': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Regular.ttf'),
      '500': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Medium.ttf'),
      '600': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-SemiBold.ttf'),
      '700': require('@/assets/fonts/Roboto_Condensed/static/RobotoCondensed-Bold.ttf'),
    },
    defaultSize: 18,
  },
  Roboto_Slab: {
    files: {
      '100': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-Thin.ttf'),
      '200': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-ExtraLight.ttf'),
      '300': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-Light.ttf'),
      '400': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf'),
      '500': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf'),
      '600': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-SemiBold.ttf'),
      '700': require('@/assets/fonts/Roboto_Slab/static/RobotoSlab-Bold.ttf'),
    },
    defaultSize: 18,
  },
} as const;

export const fonts = Object.entries(fontData).map(([folder, info]) => {
  const name = folder.replace(/_/g, ' ');
  const family = folder;
  const weights = Object.keys(info.files).sort();
  const defaultWeight = weights.includes('500') ? '500' : weights[0];
  return {
    name,
    family,
    weights,
    files: info.files,
    defaultSize: info.defaultSize,
    defaultWeight,
  };
});

export const defaultFontName = 'Comfortaa';

export const getFontFamily = (family: string, weight: string) => `${family}_${weight}`;

