import { MaterialIcons } from '@expo/vector-icons';

export const DrawerIcon = (
  name: React.ComponentProps<typeof MaterialIcons>['name'],
) =>
  ({ color, size }: { color: string; size: number }) => (
    <MaterialIcons name={name} size={size} color={color} />
  );
