import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import claudeArchitecture from '../../.claude/contracts/index.js';

export default tseslint.config(
  // 1. Global ignores
  {
    ignores: ['**/dist', 'eslint.config.js', '.history/**', '.claude/**'],
  },

  // 2. Node globals for config files
  {
    files: ['*.{js,ts,cjs,mjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
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
  // 注意：auth-service 不启用 ADR-002，因为它本身就是认证服务，需要使用 jsonwebtoken
  {
    plugins: {
      '@claude/architecture': {
        rules: claudeArchitecture.rules,
      },
    },
    rules: {
      '@claude/architecture/adr-004-no-bcrypt-new-password': 'error',
      '@claude/architecture/adr-006-no-prisma-as-any': 'error',
    },
  },

  // 10. Prettier config must be last
  prettierConfig,
);
