import React from "react";
import { Animated, StyleProp, TextStyle } from "react-native";
import styledNative, { DefaultTheme, useTheme } from "styled-components/native";

type AppTextProps = {
  variant?: keyof DefaultTheme["fontSize"];
  color?: keyof DefaultTheme['colors'];
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  animatedFontSize?: Animated.AnimatedInterpolation<number> | Animated.Value;
};

interface BaseTextProps {
  textColor: string;
}

const BaseText = styledNative.Text<BaseTextProps>`
  color: ${(props: BaseTextProps) => props.textColor};
  font-family: 'MainFont';
`;

const AnimatedText = Animated.createAnimatedComponent(BaseText);

const AppText: React.FC<AppTextProps> = ({
  variant = "medium",
  color = "basic",
  children,
  style,
  animatedFontSize,
}) => {
  const theme = useTheme();

  return (
    <AnimatedText
      style={[{ fontSize: animatedFontSize ?? theme.fontSize[variant] }, style]}
      textColor={theme.colors[color]}
    >
      {children}
    </AnimatedText>
  );
};

export default AppText;
