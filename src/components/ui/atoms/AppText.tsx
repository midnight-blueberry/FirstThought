import React from 'react';
import { TextProps, TextStyle } from 'react-native';
import styled, { DefaultTheme } from 'styled-components/native';
import { resolveFont } from '@/constants/fonts/resolve';
import { useSettings } from '@/state/SettingsContext';
import { toFamilyKey } from '@utils/font';
import useTheme from '@hooks/useTheme';

export type AppTextProps = TextProps & {
  variant?: keyof DefaultTheme['fontSize'];
  color?: keyof DefaultTheme['colors'];
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
};

interface StyledTextProps {
  fontSize: number;
  textColor: string;
  fontFamily: string;
}

const StyledText = styled.Text<StyledTextProps>`
  color: ${(props) => props.textColor};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

const AppText: React.FC<AppTextProps> = ({
  variant = 'medium',
  color = 'basic',
  children,
  style,
  fontFamily: propFamily,
  fontWeight: propWeight,
  ...rest
}) => {
  const theme = useTheme();
  const { settings } = useSettings();
  const weight = propWeight ?? settings.fontWeight;
  const familyKey = toFamilyKey(propFamily ?? settings.fontFamily);
  const { key } = resolveFont(familyKey, parseInt(String(weight), 10));

  return (
    <StyledText
      {...rest}
      style={style}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
      fontFamily={key}
      maxFontSizeMultiplier={3}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
export { AppText };
