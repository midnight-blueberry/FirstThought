import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Игнорируем сборочные артефакты и внешние зависимости
  { ignores: ['vendor/**', 'dist/**', 'build/**', 'coverage/**', 'node_modules/**', '**/generated/**'] },

  // Базовые правила для JS/JSX без TS-плагина
  js.configs.recommended,
  ...compat.extends('expo', 'plugin:react/recommended'),

  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    rules: {},
  },

  // Конфигурационные и инфраструктурные файлы без типовых правил
  {
    files: [
      '**/*.config.{js,cjs,mjs}',
      'eslint.config.mjs',
      'vite.config.{js,mjs}',
      'scripts/**/*.{js,mjs,cjs}',
    ],
    rules: {
      '@typescript-eslint/await-thenable': 'off',
    },
  },

  // Типизированные правила только для TS/TSX
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.resolve(__dirname, '../../tsconfig.eslint.json'),
        tsconfigRootDir: path.resolve(__dirname, '../..'),
      },
      globals: { ...globals.browser, ...globals.node, ...globals.jest },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs['recommended-type-checked'].rules,
      '@typescript-eslint/await-thenable': 'error',
    },
  },
];
