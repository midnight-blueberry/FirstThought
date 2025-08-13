import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components/native';
import AppText from '../atoms/app-text';
import { fonts } from '@/constants/Fonts';

interface SelectableRowProps {
  label: string;
  swatchColor?: string;
  selected: boolean;
  onPress: () => void;
  labelFont?: string;
}

const SelectableRow: React.FC<SelectableRowProps> = ({ label, swatchColor, selected, onPress, labelFont }) => {
  const theme = useTheme();
  const lift = theme.spacing.small / 2;
  const paddingLeftBase = theme.spacing.medium + (theme.iconSize.large - theme.iconSize.small) / 2;
  const paddingLeft = swatchColor ? paddingLeftBase : theme.spacing.medium;

  const weight = labelFont ? fonts[labelFont as keyof typeof fonts]?.fontWeight || theme.fontWeight : theme.fontWeight;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        styles.container,
        { 
          borderColor: theme.colors.background,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          paddingRight: theme.iconSize.large + theme.spacing.medium * 2,
          paddingVertical: theme.spacing.medium,
          paddingLeft,
          minHeight: theme.iconSize.large + theme.spacing.medium * 2,
          justifyContent: 'center',
        },
        selected && { borderColor: theme.colors.accent },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {swatchColor && (
          <View
            style={{
              width: theme.iconSize.small,
              height: theme.iconSize.small,
              backgroundColor: swatchColor,
              borderRadius: theme.borderRadius / 2,
              marginRight: paddingLeftBase,
              borderColor: theme.colors.basic,
              borderWidth: theme.borderWidth.xsmall,
            }}
          />
        )}
        <AppText
          variant="medium"
          style={{ transform: [{ translateY: -lift }], fontFamily: labelFont, fontWeight: weight }}
        >
          {label}
        </AppText>
      </View>
      <View
        style={{
          position: 'absolute',
          top: theme.spacing.medium,
          right: theme.spacing.medium,
          bottom: theme.spacing.medium,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateY: -lift }],
        }}
      >
        <Ionicons
          name="checkmark-sharp"
          size={theme.iconSize.large}
          color={theme.colors.accent}
          style={{ opacity: selected ? 1 : 0 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
});

export default SelectableRow;
