import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Другие твои конфиги, если есть
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json', // важно для проверки типов
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      // Рекомендованные правила с проверкой типов
      ...tseslint.configs.recommendedTypeChecked.rules,
      // (опционально) без строгих проверок стиля
    },
  }
);
