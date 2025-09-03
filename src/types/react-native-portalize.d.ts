declare module 'react-native-portalize' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export const PortalProvider: React.ComponentType<{ children?: React.ReactNode }>;
  export const Portal: React.ComponentType<{ children?: React.ReactNode }>;
}
