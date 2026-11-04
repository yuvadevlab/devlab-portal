import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import path from "node:path";
import tseslint from "typescript-eslint";

const rootDir = import.meta.dirname;

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.turbo/**",
      "**/dist/**",
      "**/coverage/**",
      "**/build/**",
      "**/.output/**",
      "**/.vercel/**",
      "**/out/**",
      "**/next-env.d.ts",
      "**/prisma/generated/**",
      "**/tsup.config.*",
      "**/vite.config.*",
      "**/vitest.config.*",
      "**/next.config.*",
      "**/postcss.config.*",
    ],
  },
  {
    // Scope tailwindcss rules strictly to frontend apps that contain Tailwind CSS
    ...tailwindcss.configs.recommended,
    files: ["apps/web/**/*.{ts,tsx}"],
    rules: {
      ...tailwindcss.configs.recommended.rules,
      "tailwindcss/classnames-order": "off",
      "tailwindcss/no-custom-classname": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "cva"],
        cssConfigPath: path.resolve(rootDir, "apps/web/src/app/globals.css"),
      },
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootDir,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      /**
       * Enforce the 250-line hard maximum per file.
       */
      "max-lines": [
        "error",
        {
          max: 250,
          skipComments: true,
          skipBlankLines: true,
        },
      ],
      "max-len": [
        "warn",
        {
          code: 100,
          tabWidth: 2,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],
    },
  },
  {
    files: ["prisma/**/*.ts", "scripts/**/*.ts"],
    rules: {
      "no-console": "off",
    },
  },
  eslintPluginPrettier,
);
