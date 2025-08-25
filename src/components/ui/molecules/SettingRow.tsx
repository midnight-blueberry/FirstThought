import React from 'react';
import { Pressable, View } from 'react-native';
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
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  icon,
  right,
  onPress,
  disabled,
  testID,
}) => {
  const theme = useTheme();
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={disabled ? { disabled } : undefined}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.margin.small,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        {icon ? <View style={{ marginRight: theme.margin.medium }}>{icon}</View> : null}
        <View style={{ flex: 1 }}>
          <AppText variant="medium">{title}</AppText>
          {subtitle ? <AppText variant="small">{subtitle}</AppText> : null}
        </View>
      </View>
      {right ? <View style={{ marginLeft: theme.margin.medium }}>{right}</View> : null}
    </Wrapper>
  );
};

export default SettingRow;
