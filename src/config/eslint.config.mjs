import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../');

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.expo/**',
      '**/vendor/**',
      'ChatGPT/**',
      '*.zip'
    ]
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(rootDir, 'src/config/tsconfig.eslint.json'),
        tsconfigRootDir: rootDir
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error'
    }
  },
  {
    files: ['**/*.config.{js,cjs,mjs}', 'jest.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];
