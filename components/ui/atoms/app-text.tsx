import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styledNative, { DefaultTheme, useTheme } from "styled-components/native";

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

const StyledText = styledNative.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  font-size: ${(props: StyledTextProps) => props.fontSize}px;
  font-family: ${(props: StyledTextProps) => props.fontFamily};
  font-weight: ${(props: StyledTextProps) => props.fontWeight};
`;

const AppText: React.FC<AppTextProps> = ({ variant = "medium", color = "basic", children, style, fontFamily, fontWeight }) => {
  const theme = useTheme();

  return (
    <StyledText
      style={style}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
      fontFamily={fontFamily ?? theme.fontName}
      fontWeight={fontWeight ?? theme.fontWeight}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
