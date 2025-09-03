import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '@hooks/useTheme';

type Props = { color?: string };

export default function StatusBarOverlay({ color }: Props) {
  const { top } = useSafeAreaInsets();
  const { colors } = useTheme();
  if (top === 0) return null;
  return <View style={{ height: top, backgroundColor: color ?? colors.headerBackground }} />;
}
