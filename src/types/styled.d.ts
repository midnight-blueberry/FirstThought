import 'styled-components/native';
import { TextStyle } from 'react-native';
import { ColorTokens } from '../../constants/theme/colors';
import { SizeTokens } from '../../constants/theme/tokens';

declare module 'styled-components/native' {
  export interface DefaultTheme extends SizeTokens {
    name: string;
    colors: ColorTokens;
    fontName: string;
    fontWeight: TextStyle['fontWeight'];
    noteTextAlign: 'left' | 'justify';
  }
}
