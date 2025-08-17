/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import React, { useMemo, useState } from 'react';
import { TextInputProps } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled, { DefaultTheme, useTheme } from 'styled-components/native';

const FlattenRow = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-left: 16px;
`;

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  padding-vertical: ${({ theme }: { theme: DefaultTheme }) =>
    theme.spacing.small + 2}px;
  padding-left: 12px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius}px;
  overflow: hidden;
`;

const BorderSvg: React.FC<{ w: number; h: number; bw: number; r: number; color: string }> = ({ w, h, bw, r, color }) => {
  // полпикселя внутрь, чтобы штрих не обрезался и не давал субпикселей
  const half = bw / 2;
  return (
    <Svg
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, top: 0 }}
      width={w}
      height={h}
    >
      <Rect
        x={half}
        y={half}
        width={w - bw}
        height={h - bw}
        rx={Math.round(r)}
        ry={Math.round(r)}
        stroke={color}
        strokeWidth={bw}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </Svg>
  );
};

const StyledInput = styled.TextInput.attrs(({ theme }: { theme: DefaultTheme }) => ({
  placeholderTextColor: theme.colors.disabled,
  includeFontPadding: false,
  underlineColorAndroid: 'transparent',
}))`
  flex: 1;
  text-align-vertical: center;
  padding-vertical: 0px;
  font-family: ${({ theme }: { theme: DefaultTheme }) => theme.fontName};
  font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeight};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.fontSize.medium}px;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.basic};
`;

const SearchButton = styled.TouchableOpacity`
  padding-left: 8px;
  padding-right: 12px;
  justify-content: center;
  align-items: center;
`;

const InputField: React.FC<TextInputProps> = (props) => {
  const [value, setValue] = useState<string>('');
  const [w, setW] = useState(0);
  const theme = useTheme();

  const FIELD_H = useMemo(() => {
    const h =
      theme.iconSize.small +
      (theme.spacing.small + 2) * 2 +
      theme.borderWidth.medium * 2 +
      4;
    return Math.round(h);
  }, [theme]);

  return (
    <FlattenRow>
      <Container
        onLayout={(e) => setW(Math.round(e.nativeEvent.layout.width))}
        style={{ height: FIELD_H }}
      >
        {w > 0 && (
          <BorderSvg
            w={w}
            h={FIELD_H}
            bw={theme.borderWidth.medium}
            r={theme.borderRadius}
            color={theme.colors.basic}
          />
        )}
        <StyledInput
          value={value}
          onChangeText={setValue}
          style={{ height: FIELD_H }}
          {...props}
        />
        <SearchButton>
          <Ionicons name="search" size={theme.iconSize.small} color={theme.colors.basic} />
        </SearchButton>
      </Container>
    </FlattenRow>
  );
};

export default InputField;
