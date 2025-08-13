import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styledNative, { DefaultTheme, useTheme } from "styled-components/native";

type AppTextProps = {
  variant?: keyof DefaultTheme["fontSize"];
  color?: keyof DefaultTheme['colors'];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

// Типы пропсов для StyledText
interface StyledTextProps {
  fontSize: number;
  textColor: string;
}

const StyledText = styledNative.Text<StyledTextProps>`
  color: ${(props: StyledTextProps) => props.textColor};
  font-size: ${(props: StyledTextProps) => props.fontSize}px;
  font-family: 'MainFont';
`;

const AppText: React.FC<AppTextProps> = ({ variant = "medium", color = "basic", children, style }) => {
  const theme = useTheme();

  return (
    <StyledText
      style={style}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
