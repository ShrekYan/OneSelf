import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: ['dist', 'eslint.config.js', '.history/**'],
  },

  // 2. Node globals for config files
  {
    files: ['*.{js,ts,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // 3. ESLint recommended rules
  js.configs.recommended,

  // 4. TypeScript recommended rules
  ...tseslint.configs.recommended,

  // 5. Configuration for type-aware rules (only for TS files)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 5. React specific rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // 7. Generic custom rules
  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
    },
  },

  // 8. TypeScript-specific custom rules (type-aware)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // 9. Prettier config must be last
  prettierConfig,
);
