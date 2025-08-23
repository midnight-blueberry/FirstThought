const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'react-native-is-edge-to-edge': path.resolve(__dirname, 'src/polyfills/react-native-is-edge-to-edge.ts'),
};

module.exports = config;
