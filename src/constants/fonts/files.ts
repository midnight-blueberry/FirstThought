import type { FontFamily, FontSource } from './types';

import BadScriptRegular from '@assets/fonts/Bad_Script/BadScript-Regular.ttf';
import ComfortaaVariable from '@assets/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf';
import LoraVariable from '@assets/fonts/Lora/Lora-VariableFont_wght.ttf';
import MontserratVariable from '@assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
import NataSansVariable from '@assets/fonts/Nata_Sans/NataSans-VariableFont_wght.ttf';
import PTSansRegular from '@assets/fonts/PT_Sans/PTSans-Regular.ttf';
import RalewayVariable from '@assets/fonts/Raleway/Raleway-VariableFont_wght.ttf';
import RobotoCondensedVariable from '@assets/fonts/Roboto_Condensed/RobotoCondensed-VariableFont_wght.ttf';
import RobotoSlabVariable from '@assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf';

export const FONT_FILES: Record<FontFamily, FontSource> = {
  Bad_Script: BadScriptRegular,
  Comfortaa: ComfortaaVariable,
  Lora: LoraVariable,
  Montserrat: MontserratVariable,
  Nata_Sans: NataSansVariable,
  PT_Sans: PTSansRegular,
  Raleway: RalewayVariable,
  Roboto_Condensed: RobotoCondensedVariable,
  Roboto_Slab: RobotoSlabVariable,
} as const;
