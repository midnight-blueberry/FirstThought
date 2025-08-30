import 'styled-components/native';
import { TextStyle } from 'react-native';
import type { ColorTokens, SizeTokens } from '@constants/theme';

declare module 'styled-components/native' {
  export interface DefaultTheme extends SizeTokens {
    name: string;
    colors: ColorTokens;
    fontName: string;
    fontWeight: TextStyle['fontWeight'];
    noteTextAlign: 'left' | 'justify';
    barStyle: 'light-content' | 'dark-content';
  }
}
