import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: ['dist', 'eslint.config.js'],
  },

  // 2. ESLint recommended rules
  js.configs.recommended,

  // 3. TypeScript recommended rules that require type-checking
  ...tseslint.configs.recommendedTypeChecked,

  // 4. Configuration to provide tsconfig.json path for type-aware rules
  {
    languageOptions: {
      parserOptions: {
        project: true,
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
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // 6. Other custom rules (optional, as many are covered by recommended)
  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/no-misused-promises': 'off',
    },
  },

  // 7. Prettier config must be last to override other formatting rules
  prettierConfig,
);
