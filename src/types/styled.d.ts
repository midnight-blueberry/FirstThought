import 'styled-components/native';
import { ColorTokens } from '../../theme/colors';
import { SizeTokens } from '../../theme/tokens';
import { TextStyle } from 'react-native';

declare module 'styled-components/native' {
  export interface DefaultTheme extends SizeTokens {
    name: string;
    colors: ColorTokens;
    fontFamily: string;
    fontWeight: TextStyle['fontWeight'];
  }
}
