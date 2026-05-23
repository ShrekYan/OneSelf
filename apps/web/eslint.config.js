import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import claudeArchitecture from '../../.claude/contracts/index.js';

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.min.js',
      'eslint.config.js',
      '.history/**',
      '.claude/**',
    ],
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

  // 6. React specific rules
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

  // 9. Claude Architecture Rules - 架构契约校验
  {
    plugins: {
      '@claude/architecture': {
        rules: claudeArchitecture.rules,
      },
    },
    rules: {
      '@claude/architecture/adr-003-no-localstorage-token': 'error',
      '@claude/architecture/fadr-003-no-mobx-observer-hoc': 'error',
    },
  },

  // 10. Prettier config must be last
  prettierConfig,
);
