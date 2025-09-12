import type { LinkingOptions } from '@react-navigation/native';
import type { DrawerParamList } from './routes';

export const drawerLinking: LinkingOptions<DrawerParamList> = {
  prefixes: ['firstthought://'],
  config: {
    screens: {
      Home: '',
      Settings: 'settings',
    },
  },
};

