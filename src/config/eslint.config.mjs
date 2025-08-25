import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

const typedFiles = [
  "src/**/*.{ts,tsx}",
  "app/**/*.{ts,tsx}",
  "ChatGPT/src/**/*.{ts,tsx}",
  "ChatGPT/app/**/*.{ts,tsx}",
];

export default [
  {
    ignores: [
      "ChatGPT/**",
      "ChatGPT.zip",
    ],
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.expo/**",
      "ChatGPT/.expo/**",
      "**/*.d.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ...js.configs.recommended,
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx,js,jsx}"],
  })),
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typedFiles,
    languageOptions: {
      ...config.languageOptions,
      parserOptions: {
        ...config.languageOptions?.parserOptions,
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      ...config.plugins,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    rules: {
      ...config.rules,
      "@typescript-eslint/await-thenable": "error",
    },
  })),
];

