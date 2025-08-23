import { getFontByName, adjustWeight } from '@utils/fontHelpers';
import BadScriptRegular from '@assets/fonts/Bad_Script/static/BadScript-Regular.ttf';
import ComfortaaLight from '@assets/fonts/Comfortaa/static/Comfortaa-Light.ttf';
import ComfortaaRegular from '@assets/fonts/Comfortaa/static/Comfortaa-Regular.ttf';
import ComfortaaMedium from '@assets/fonts/Comfortaa/static/Comfortaa-Medium.ttf';
import ComfortaaSemiBold from '@assets/fonts/Comfortaa/static/Comfortaa-SemiBold.ttf';
import ComfortaaBold from '@assets/fonts/Comfortaa/static/Comfortaa-Bold.ttf';
import LoraRegular from '@assets/fonts/Lora/static/Lora-Regular.ttf';
import LoraMedium from '@assets/fonts/Lora/static/Lora-Medium.ttf';
import LoraSemiBold from '@assets/fonts/Lora/static/Lora-SemiBold.ttf';
import LoraBold from '@assets/fonts/Lora/static/Lora-Bold.ttf';
import MontserratLight from '@assets/fonts/Montserrat/static/Montserrat-Light.ttf';
import MontserratRegular from '@assets/fonts/Montserrat/static/Montserrat-Regular.ttf';
import MontserratMedium from '@assets/fonts/Montserrat/static/Montserrat-Medium.ttf';
import MontserratSemiBold from '@assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf';
import MontserratBold from '@assets/fonts/Montserrat/static/Montserrat-Bold.ttf';
import NataSansLight from '@assets/fonts/Nata_Sans/static/NataSans-Light.ttf';
import NataSansRegular from '@assets/fonts/Nata_Sans/static/NataSans-Regular.ttf';
import NataSansMedium from '@assets/fonts/Nata_Sans/static/NataSans-Medium.ttf';
import NataSansSemiBold from '@assets/fonts/Nata_Sans/static/NataSans-SemiBold.ttf';
import NataSansBold from '@assets/fonts/Nata_Sans/static/NataSans-Bold.ttf';
import PTSansRegular from '@assets/fonts/PT_Sans/static/PTSans-Regular.ttf';
import PTSansBold from '@assets/fonts/PT_Sans/static/PTSans-Bold.ttf';
import RalewayLight from '@assets/fonts/Raleway/static/Raleway-Light.ttf';
import RalewayRegular from '@assets/fonts/Raleway/static/Raleway-Regular.ttf';
import RalewayMedium from '@assets/fonts/Raleway/static/Raleway-Medium.ttf';
import RalewaySemiBold from '@assets/fonts/Raleway/static/Raleway-SemiBold.ttf';
import RalewayBold from '@assets/fonts/Raleway/static/Raleway-Bold.ttf';
import RobotoCondensedLight from '@assets/fonts/Roboto_Condensed/static/RobotoCondensed-Light.ttf';
import RobotoCondensedRegular from '@assets/fonts/Roboto_Condensed/static/RobotoCondensed-Regular.ttf';
import RobotoCondensedMedium from '@assets/fonts/Roboto_Condensed/static/RobotoCondensed-Medium.ttf';
import RobotoCondensedSemiBold from '@assets/fonts/Roboto_Condensed/static/RobotoCondensed-SemiBold.ttf';
import RobotoCondensedBold from '@assets/fonts/Roboto_Condensed/static/RobotoCondensed-Bold.ttf';
import RobotoSlabLight from '@assets/fonts/Roboto_Slab/static/RobotoSlab-Light.ttf';
import RobotoSlabRegular from '@assets/fonts/Roboto_Slab/static/RobotoSlab-Regular.ttf';
import RobotoSlabMedium from '@assets/fonts/Roboto_Slab/static/RobotoSlab-Medium.ttf';
import RobotoSlabSemiBold from '@assets/fonts/Roboto_Slab/static/RobotoSlab-SemiBold.ttf';
import RobotoSlabBold from '@assets/fonts/Roboto_Slab/static/RobotoSlab-Bold.ttf';

export const fontData = {
  Bad_Script: {
    files: {
      '400': BadScriptRegular,
    },
    defaultSize: 22,
  },
  Comfortaa: {
    files: {
      '300': ComfortaaLight,
      '400': ComfortaaRegular,
      '500': ComfortaaMedium,
      '600': ComfortaaSemiBold,
      '700': ComfortaaBold,
    },
    defaultSize: 18,
  },
  Lora: {
    files: {
      '400': LoraRegular,
      '500': LoraMedium,
      '600': LoraSemiBold,
      '700': LoraBold,
    },
    defaultSize: 18,
  },
  Montserrat: {
    files: {
      '300': MontserratLight,
      '400': MontserratRegular,
      '500': MontserratMedium,
      '600': MontserratSemiBold,
      '700': MontserratBold,
    },
    defaultSize: 18,
  },
  Nata_Sans: {
    files: {
      '300': NataSansLight,
      '400': NataSansRegular,
      '500': NataSansMedium,
      '600': NataSansSemiBold,
      '700': NataSansBold,
    },
    defaultSize: 18,
  },
  PT_Sans: {
    files: {
      '400': PTSansRegular,
      '700': PTSansBold,
    },
    defaultSize: 18,
  },
  Raleway: {
    files: {
      '300': RalewayLight,
      '400': RalewayRegular,
      '500': RalewayMedium,
      '600': RalewaySemiBold,
      '700': RalewayBold,
    },
    defaultSize: 18,
  },
  Roboto_Condensed: {
    files: {
      '300': RobotoCondensedLight,
      '400': RobotoCondensedRegular,
      '500': RobotoCondensedMedium,
      '600': RobotoCondensedSemiBold,
      '700': RobotoCondensedBold,
    },
    defaultSize: 18,
  },
  Roboto_Slab: {
    files: {
      '300': RobotoSlabLight,
      '400': RobotoSlabRegular,
      '500': RobotoSlabMedium,
      '600': RobotoSlabSemiBold,
      '700': RobotoSlabBold,
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

export const getNextFontWeight = (family: string, currentWeight: string) => {
  const name = family.replace(/_/g, ' ');
  const font = getFontByName(fonts, name);
  const next = adjustWeight(font, currentWeight, 1);
  return next ?? currentWeight;
};

