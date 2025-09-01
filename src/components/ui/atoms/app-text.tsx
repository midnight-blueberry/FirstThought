 
import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";
import useTheme from '@hooks/useTheme';
import { resolveFont, listAvailableWeights } from "@constants/fonts";
import { toFamilyKey } from "@utils/font";
import { useSettings } from '@/state/SettingsContext';

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
  const { settings } = useSettings();

  const familyKey = toFamilyKey(fontFamily ?? settings.fontFamily);
  const baseWeight = parseInt(String(fontWeight ?? settings.fontWeight), 10);
  let chosenWeight = baseWeight;

  if ((variant === 'large' || variant === 'xlarge') && !fontWeight) {
    const weights = listAvailableWeights(familyKey);
    const idx = weights.indexOf(baseWeight);
    if (idx >= 0 && idx < weights.length - 1) {
      chosenWeight = weights[idx + 1];
    }
  }

  const { key, weight: resolvedWeight } = resolveFont(familyKey, chosenWeight);

  return (
    <StyledText
      style={style}
      textColor={theme.colors[color]}
      fontSize={theme.fontSize[variant]}
      fontFamily={key}
      fontWeight={String(resolvedWeight) as TextStyle['fontWeight']}
      maxFontSizeMultiplier={3}
    >
      {children}
    </StyledText>
  );
};

export default AppText;
