export type FontFamily =
  | 'Bad_Script'
  | 'Comfortaa'
  | 'Lora'
  | 'Montserrat'
  | 'Nata_Sans'
  | 'PT_Sans'
  | 'Raleway'
  | 'Roboto_Condensed'
  | 'Roboto_Slab';

export type FontWeight = '300' | '400' | '500' | '600' | '700';

export type FontStyle = 'normal' | 'italic';

export type FontKey = `${FontFamily}-${FontWeight}${'' | '-italic'}`;

export type FontSource = string | number;

export type FontMap = Partial<Record<FontWeight, FontSource>>;
