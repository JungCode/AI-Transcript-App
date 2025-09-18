// eslint.config.js
import path from 'path';
import { fileURLToPath } from 'url';

import expoConfig from 'eslint-config-expo/flat.js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// tự tạo __dirname vì ESM không có sẵn
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  // Base config cho Expo/React Native
  expoConfig,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true, // cho typed linting
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },

  // ignore build artifacts / file generate
  {
    ignores: ['dist', '**/schemas.tsx'],
  },
]);
