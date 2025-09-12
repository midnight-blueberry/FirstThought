// .eslintrc.cjs
module.exports = {
  // ... текущая конфигурация
  overrides: [
    // оставь существующие overrides, если есть
    {
      files: ['jest.config.ts', '*.config.ts', '*.config.cjs', '*.config.mjs'],
      parserOptions: {
        project: null,      // отключает type-aware для этих файлов
      },
    },
  ],
};
