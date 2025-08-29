import type { FontFamily, FontWeight, FontStyle, FontSource } from './types';

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

export const FONT_VARIANTS = {
  Bad_Script: {
    '400': { normal: BadScriptRegular },
  },
  Comfortaa: {
    '300': { normal: ComfortaaLight },
    '400': { normal: ComfortaaRegular },
    '500': { normal: ComfortaaMedium },
    '600': { normal: ComfortaaSemiBold },
    '700': { normal: ComfortaaBold },
  },
  Lora: {
    '400': { normal: LoraRegular },
    '500': { normal: LoraMedium },
    '600': { normal: LoraSemiBold },
    '700': { normal: LoraBold },
  },
  Montserrat: {
    '300': { normal: MontserratLight },
    '400': { normal: MontserratRegular },
    '500': { normal: MontserratMedium },
    '600': { normal: MontserratSemiBold },
    '700': { normal: MontserratBold },
  },
  Nata_Sans: {
    '300': { normal: NataSansLight },
    '400': { normal: NataSansRegular },
    '500': { normal: NataSansMedium },
    '600': { normal: NataSansSemiBold },
    '700': { normal: NataSansBold },
  },
  PT_Sans: {
    '400': { normal: PTSansRegular },
    '700': { normal: PTSansBold },
  },
  Raleway: {
    '300': { normal: RalewayLight },
    '400': { normal: RalewayRegular },
    '500': { normal: RalewayMedium },
    '600': { normal: RalewaySemiBold },
    '700': { normal: RalewayBold },
  },
  Roboto_Condensed: {
    '300': { normal: RobotoCondensedLight },
    '400': { normal: RobotoCondensedRegular },
    '500': { normal: RobotoCondensedMedium },
    '600': { normal: RobotoCondensedSemiBold },
    '700': { normal: RobotoCondensedBold },
  },
  Roboto_Slab: {
    '300': { normal: RobotoSlabLight },
    '400': { normal: RobotoSlabRegular },
    '500': { normal: RobotoSlabMedium },
    '600': { normal: RobotoSlabSemiBold },
    '700': { normal: RobotoSlabBold },
  },
} as const satisfies Record<
  FontFamily,
  Partial<Record<FontWeight, Partial<Record<FontStyle, FontSource>>>>
>;
