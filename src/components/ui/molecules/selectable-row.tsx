import React from 'react';
import { TextStyle, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import { AppText } from '@components/ui/atoms';

interface SelectableRowProps {
  label: string;
  swatchColor?: string;
  selected: boolean;
  onPress: () => void;
  fontFamily?: string;
  fontWeight?: TextStyle['fontWeight'];
  fontSize?: number;
}

const SelectableRow: React.FC<SelectableRowProps> = ({
  label,
  swatchColor,
  selected,
  onPress,
  fontFamily,
  fontWeight,
  fontSize,
}) => {
  const theme = useTheme();
  const drop = -theme.padding.small / 4;
  const hasSwatch = !!swatchColor;
  const paddingLeft = hasSwatch
    ? theme.margin.medium + (theme.iconSize.large - theme.iconSize.small) / 2
    : theme.margin.medium;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        {
          marginBottom: theme.margin.small,
          borderColor: theme.colors.background,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          paddingRight: theme.iconSize.large + theme.padding.medium * 2,
          paddingVertical: theme.padding.medium,
          paddingLeft,
          minHeight: theme.iconSize.large + theme.padding.medium * 2,
          justifyContent: 'center',
        },
        selected && { borderColor: theme.colors.accent },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {hasSwatch && (
          <View
            style={{
              width: theme.iconSize.small,
              height: theme.iconSize.small,
              backgroundColor: swatchColor,
              borderRadius: theme.borderRadius / 2,
              marginRight: paddingLeft,
              borderColor: theme.colors.basic,
              borderWidth: theme.borderWidth.xsmall,
            }}
          />
        )}
        <AppText
          variant="medium"
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          style={[
            { transform: [{ translateY: drop }] },
            fontSize
              ? { fontSize, lineHeight: fontSize + theme.padding.medium }
              : null,
          ]}
        >
          {label}
        </AppText>
      </View>
      <View
        style={{
          position: 'absolute',
          top: theme.padding.medium,
          right: theme.padding.medium,
          width: theme.iconSize.large,
          height: theme.iconSize.large,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons
          name="checkmark-sharp"
          size={theme.iconSize.large}
          color={theme.colors.accent}
          style={{
            opacity: selected ? 1 : 0,
            transform: [{ translateY: drop }],
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default SelectableRow;
