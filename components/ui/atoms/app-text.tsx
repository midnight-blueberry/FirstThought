// components/AppText.tsx
import { defaultTheme, DefaultTheme } from "@/theme";
import styled from "styled-components/native";

type AppTextProps = {
  variant?: keyof typeof defaultTheme.fontSizes; // "small" | "medium" | ...
};

const AppText = styled.Text<AppTextProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text};
  font-size: ${({ theme, variant = "medium" }: { 
      theme: DefaultTheme; 
      variant: keyof typeof defaultTheme.fontSizes; 
    }) =>
    theme.fontSizes[variant]}px;
`;

export default AppText;