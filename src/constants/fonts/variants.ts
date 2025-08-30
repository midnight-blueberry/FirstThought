import BAD_SCRIPT from '@assets/fonts/Bad_Script/BadScript-Regular.ttf';
import COMFORTAA_VAR from '@assets/fonts/Comfortaa/Comfortaa-VariableFont_wght.ttf';
import LORA_VAR from '@assets/fonts/Lora/Lora-VariableFont_wght.ttf';
import MONTSERRAT_VAR from '@assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
import NATA_SANS_VAR from '@assets/fonts/Nata_Sans/NataSans-VariableFont_wght.ttf';
import PT_SANS_REG from '@assets/fonts/PT_Sans/PTSans-Regular.ttf';
import PT_SANS_BOLD from '@assets/fonts/PT_Sans/PTSans-Bold.ttf';
import RALEWAY_VAR from '@assets/fonts/Raleway/Raleway-VariableFont_wght.ttf';
import ROBOTO_CONDENSED_VAR from '@assets/fonts/Roboto_Condensed/RobotoCondensed-VariableFont_wght.ttf';
import ROBOTO_SLAB_VAR from '@assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf';

export const FONT_SOURCES = {
  Bad_Script: { regular: BAD_SCRIPT },
  Comfortaa: { variable: COMFORTAA_VAR },
  Lora: { variable: LORA_VAR },
  Montserrat: { variable: MONTSERRAT_VAR },
  Nata_Sans: { variable: NATA_SANS_VAR },
  PT_Sans: { regular: PT_SANS_REG, bold: PT_SANS_BOLD },
  Raleway: { variable: RALEWAY_VAR },
  Roboto_Condensed: { variable: ROBOTO_CONDENSED_VAR },
  Roboto_Slab: { variable: ROBOTO_SLAB_VAR },
} as const;
