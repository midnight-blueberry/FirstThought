import type { FontFamily, FontWeight, FontStyle, FontSource } from './types';

import BadScriptRegular from '@assets/fonts/Bad_Script/BadScript-Regular.ttf';
import ComfortaaVariable from '@assets/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf';
import LoraVariable from '@assets/fonts/Lora/Lora-VariableFont_wght.ttf';
import MontserratVariable from '@assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
import NataSansVariable from '@assets/fonts/Nata_Sans/NataSans-VariableFont_wght.ttf';
import PTSansRegular from '@assets/fonts/PT_Sans/PTSans-Regular.ttf';
import PTSansBold from '@assets/fonts/PT_Sans/PTSans-Bold.ttf';
import RalewayVariable from '@assets/fonts/Raleway/Raleway-VariableFont_wght.ttf';
import RobotoCondensedVariable from '@assets/fonts/Roboto_Condensed/RobotoCondensed-VariableFont_wght.ttf';
import RobotoSlabVariable from '@assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf';

export const FONT_VARIANTS = {
  Bad_Script: {
    '400': { normal: BadScriptRegular },
  },
  Comfortaa: {
    '300': { normal: ComfortaaVariable },
    '400': { normal: ComfortaaVariable },
    '500': { normal: ComfortaaVariable },
    '600': { normal: ComfortaaVariable },
    '700': { normal: ComfortaaVariable },
  },
  Lora: {
    '400': { normal: LoraVariable },
    '500': { normal: LoraVariable },
    '600': { normal: LoraVariable },
    '700': { normal: LoraVariable },
  },
  Montserrat: {
    '300': { normal: MontserratVariable },
    '400': { normal: MontserratVariable },
    '500': { normal: MontserratVariable },
    '600': { normal: MontserratVariable },
    '700': { normal: MontserratVariable },
  },
  Nata_Sans: {
    '300': { normal: NataSansVariable },
    '400': { normal: NataSansVariable },
    '500': { normal: NataSansVariable },
    '600': { normal: NataSansVariable },
    '700': { normal: NataSansVariable },
  },
  PT_Sans: {
    '400': { normal: PTSansRegular },
    '700': { normal: PTSansBold },
  },
  Raleway: {
    '300': { normal: RalewayVariable },
    '400': { normal: RalewayVariable },
    '500': { normal: RalewayVariable },
    '600': { normal: RalewayVariable },
    '700': { normal: RalewayVariable },
  },
  Roboto_Condensed: {
    '300': { normal: RobotoCondensedVariable },
    '400': { normal: RobotoCondensedVariable },
    '500': { normal: RobotoCondensedVariable },
    '600': { normal: RobotoCondensedVariable },
    '700': { normal: RobotoCondensedVariable },
  },
  Roboto_Slab: {
    '300': { normal: RobotoSlabVariable },
    '400': { normal: RobotoSlabVariable },
    '500': { normal: RobotoSlabVariable },
    '600': { normal: RobotoSlabVariable },
    '700': { normal: RobotoSlabVariable },
  },
} as const satisfies Record<
  FontFamily,
  Partial<Record<FontWeight, Partial<Record<FontStyle, FontSource>>>>
>;
