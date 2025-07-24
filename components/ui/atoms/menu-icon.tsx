import { ColorsContext, SizesContext } from '@/theme';
import React, { useContext } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MenuIcon: React.FC = () => {
  const { colors } = useContext(ColorsContext);
  const { sizes } = useContext(SizesContext);
  return <Ionicons name="menu" size={sizes.iconSizes.large} color={colors.text} />;
};

export default MenuIcon;