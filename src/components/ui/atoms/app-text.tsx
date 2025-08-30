 
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import useTheme from '@hooks/useTheme';
import { getNextFontWeight } from "@constants/fonts";
import type { FontFamily, FontWeight } from '@constants/fonts';

type AppTextProps = {
  variant?: keyof DefaultTheme["fontSize"];
  color?: keyof DefaultTheme['colors'];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
};

// Типы пропсов для StyledText
interface StyledTextProps {
  fontSize: number;
  textColor: string;
  fontFamily: string;
  fontWeight: TextStyle['fontWeight'];
}

const StyledText = styled.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  font-size: ${(props: StyledTextProps) => props.fontSize}px;
  font-family: ${(props: StyledTextProps) => props.fontFamily};
  font-weight: ${(props: StyledTextProps) => props.fontWeight};
`;

const AppText: React.FC<AppTextProps> = ({
  variant = "medium",
  color = "basic",
  children,
  style,
  fontFamily,
  fontWeight,
}) => {
  const theme = useTheme();

  const baseFamily = (fontFamily ?? theme.fontName) as FontFamily;
  let resolvedWeight: TextStyle['fontWeight'] = fontWeight ?? theme.fontWeight;

  if ((variant === "large" || variant === "xlarge") && !fontWeight) {
    resolvedWeight = getNextFontWeight(baseFamily, resolvedWeight as FontWeight) as TextStyle['fontWeight'];
  }

  return (
    <StyledText
      style={style}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
      fontFamily={baseFamily}
      fontWeight={resolvedWeight}
      maxFontSizeMultiplier={3}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
