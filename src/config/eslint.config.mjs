import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.resolve(__dirname, '..', '..');

// Enable compatibility with legacy ESLint configs
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  js.configs.recommended,

  // Apply any old-style "extends" here
  ...compat.extends('expo', 'plugin:@typescript-eslint/recommended-type-checked'),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json', './tsconfig.scripts.json'],
        tsconfigRootDir: __root,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: true,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'scripts/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  {
    ignores: ['vendor/**', 'dist/**', 'build/**', 'coverage/**', '**/generated/**'],
  },
];

