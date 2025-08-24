import config from '../../eslint.config.mjs';

const [baseTsConfig, baseTestOverride, ...rest] = config;

const updatedTsConfig = {
  ...baseTsConfig,
  languageOptions: {
    ...baseTsConfig.languageOptions,
    parserOptions: {
      ...baseTsConfig.languageOptions?.parserOptions,
      project: ['./tsconfig.json', './tsconfig.scripts.json'],
      tsconfigRootDir: import.meta.dirname ?? process.cwd(),
    },
  },
};

const updatedTestOverride = {
  ...baseTestOverride,
  files: ['**/*.test.ts', '**/*.test.tsx', 'scripts/__tests__/**/*.{ts,tsx}'],
  env: { ...(baseTestOverride.env || {}), jest: true },
};

export default [updatedTsConfig, updatedTestOverride, ...rest];
