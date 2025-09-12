import { LinkingOptions } from '@react-navigation/native';
import { DrawerParamList } from './routes';

export const drawerLinking: LinkingOptions<DrawerParamList> = {
  prefixes: ['firstthought://'],
  config: {
    screens: {
      Home: 'home-page',
      Settings: 'settings',
    },
  },
};
