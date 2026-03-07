import React from 'react';
import { Pressable, View, StyleProp, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppText } from '@components/ui/atoms';
import useTheme from '@hooks/useTheme';

export interface SettingRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  icon,
  right,
  onPress,
  disabled,
  testID,
  style,
}) => {
  const theme = useTheme();
  const Wrapper = onPress ? Pressable : View;
  const rightContent =
    right ?? <Ionicons name="chevron-forward" size={theme.iconSize.large} color={theme.colors.basic} />;
  const titleLineHeight = Math.ceil(theme.iconSize.large * 1.1);

  return (
    <Wrapper
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={disabled ? { disabled } : undefined}
      style={[
        {
          minHeight: theme.iconSize.large + theme.padding.medium * 2,
          paddingLeft: theme.margin.medium,
          paddingRight: theme.iconSize.large + theme.padding.medium * 2,
          paddingVertical: theme.padding.medium,
          borderColor: theme.colors.basic,
          borderWidth: theme.borderWidth.medium,
          borderRadius: theme.borderRadius,
          marginBottom: theme.margin.small,
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon ? <View style={{ marginRight: theme.margin.medium }}>{icon}</View> : null}
        <View style={{ flex: 1 }}>
          <AppText variant="medium" style={{ lineHeight: titleLineHeight, includeFontPadding: true }}>
            {title}
          </AppText>
          {subtitle ? <AppText variant="small">{subtitle}</AppText> : null}
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: theme.padding.medium,
          width: theme.iconSize.large,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {rightContent}
      </View>
    </Wrapper>
  );
};

export default SettingRow;
