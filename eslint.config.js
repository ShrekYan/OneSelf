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

  // 2. ESLint recommended rules
  js.configs.recommended,

  // 3. TypeScript recommended rules that require type-checking
  ...tseslint.configs.recommendedTypeChecked,

  // 4. Configuration to provide tsconfig.json path for type-aware rules
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.config.js', '*.config.cjs', '*.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 5. Configuration files environment
  {
    files: ['*.config.js', '*.config.cjs', '*.config.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
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

  // 6. Other custom rules (optional, as many are covered by recommended)
  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },

  // 7. Prettier config must be last to override other formatting rules
  prettierConfig,
);
