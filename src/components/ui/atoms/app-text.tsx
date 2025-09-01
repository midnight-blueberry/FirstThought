 
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import useTheme from '@hooks/useTheme';
import { closestAvailableWeight, isVariableFamily, getNextFontWeight } from '@constants/fonts';
import type { FontFamily, FontWeight } from '@constants/fonts';

type AppTextProps = {
  variant?: keyof DefaultTheme["fontSize"];
  color?: keyof DefaultTheme['colors'];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  familyKey?: FontFamily;
  weight?: FontWeight;
};

interface StyledTextProps {
  fontSize: number;
  textColor: string;
}

const StyledText = styled.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  font-size: ${(props: StyledTextProps) => props.fontSize}px;
`;

const AppText: React.FC<AppTextProps> = ({
  variant = "medium",
  color = "basic",
  children,
  style,
  familyKey,
  weight,
}) => {
  const theme = useTheme();

  const fam = familyKey ?? (theme.fontName as FontFamily);
  let w: FontWeight = weight ?? (theme.fontWeight as FontWeight);

  if ((variant === "large" || variant === "xlarge") && weight == null) {
    w = getNextFontWeight(fam, w) as FontWeight;
  }

  const styleFromFont = isVariableFamily(fam)
    ? { fontFamily: fam, fontWeight: String(w) as TextStyle['fontWeight'] }
    : { fontFamily: `${fam}-${closestAvailableWeight(fam, w)}` };

  return (
    <StyledText
      style={[style, styleFromFont]}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
      maxFontSizeMultiplier={3}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
