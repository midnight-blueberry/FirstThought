import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: { import: importPlugin },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "import/no-unresolved": ["error", { commonjs: true, caseSensitive: true }],
      "import/extensions": [
        "error",
        "ignorePackages",
        { js: "never", jsx: "never", ts: "never", tsx: "never" },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: [
      ".expo/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "vendor/**",
    ],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },
];
