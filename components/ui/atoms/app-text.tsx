 
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme, useTheme } from "styled-components/native";
import { getFontFamily, getNextFontWeight } from "@/constants/Fonts";

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
  fontSize?: number;
  textColor: string;
  fontFamily?: string;
  fontWeight: TextStyle['fontWeight'];
}

const StyledText = styled.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  ${(props: StyledTextProps) =>
    props.fontSize !== undefined ? `font-size: ${props.fontSize}px;` : ''}
  font-weight: ${(props: StyledTextProps) => props.fontWeight};
  ${(props: StyledTextProps) => (props.fontFamily ? `font-family: ${props.fontFamily};` : '')}
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

  const familyString = fontFamily ?? theme.fontName;
  const parts = familyString.split("_");
  const baseFamily = parts.slice(0, -1).join("_");
  const baseWeight = String(fontWeight ?? (parts[parts.length - 1] || theme.fontWeight));

  let resolvedWeight: TextStyle['fontWeight'] = fontWeight ?? theme.fontWeight;
  let resolvedFamily = fontFamily ?? theme.fontName;

  if (baseFamily && (variant === "large" || variant === "xlarge") && !fontWeight) {
    resolvedWeight = getNextFontWeight(baseFamily, baseWeight) as TextStyle['fontWeight'];
    resolvedFamily = getFontFamily(baseFamily, String(resolvedWeight));
  }

  const size = resolvedFamily ? theme.fontSize[variant] : undefined;

  return (
    <StyledText
      style={style}
      textColor={theme.colors[color]}
      fontSize={size}
      fontFamily={resolvedFamily || undefined}
      fontWeight={resolvedWeight}
      maxFontSizeMultiplier={3}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
