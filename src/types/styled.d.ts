import 'styled-components/native';
import { TextStyle } from 'react-native';
import { ColorTokens } from '@config/theme/colors';
import { SizeTokens } from '@config/theme/tokens';

declare module 'styled-components/native' {
  export interface DefaultTheme extends SizeTokens {
    name: string;
    colors: ColorTokens;
    fontName: string;
    fontWeight: TextStyle['fontWeight'];
    noteTextAlign: 'left' | 'justify';
  }
}
