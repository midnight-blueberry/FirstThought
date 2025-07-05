import { ColorsContext, defaultSizes, SizesContext } from "@/theme";
import React, { useContext } from "react";
import { StyleProp, TextStyle } from "react-native";
import styled from "styled-components/native";

type AppTextProps = {
  variant?: keyof typeof defaultSizes.fontSizes;
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
`;

const AppText: React.FC<AppTextProps> = ({ variant = "medium", children, style }) => {
  const { colors } = useContext(ColorsContext);
  const { sizes } = useContext(SizesContext);

  return (
    <StyledText
      style={style}
      textColor={colors.text}
      fontSize={sizes.fontSizes[variant]}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
