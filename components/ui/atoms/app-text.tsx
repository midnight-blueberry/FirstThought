import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme, useTheme } from "styled-components/native";

type AppTextProps = {
  variant?: keyof DefaultTheme["fontSize"];
  color?: keyof DefaultTheme["color"];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

// Типы пропсов для StyledText
interface StyledTextProps {
  fontSize: number;
  textColor: string;
}

const StyledText = styled.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  font-size: ${(props: StyledTextProps) => props.fontSize}px;
  font-family: 'MainFont';
`;

const AppText: React.FC<AppTextProps> = ({ variant = "medium", color = "text", children, style }) => {
  const theme = useTheme();

  return (
    <StyledText
      style={style}
      textColor={theme.color[color]}
      fontSize={theme.fontSize[variant]}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
