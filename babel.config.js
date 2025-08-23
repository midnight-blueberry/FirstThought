module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          '@screens': './src/screens',
          '@components': './src/components',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@store': './src/store',
          '@assets': './assets',
          '@utils': './src/utils',
          '@settings': './src/settings',
          '@theme': './src/theme',
          '@storage': './src/storage'
        }
      }]
    ]
  };
};
