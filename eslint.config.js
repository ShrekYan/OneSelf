// Monorepo 根目录 ESLint 配置
// 作用：lint-staged 提交前快速检查，不做 type-aware 检查（由各项目 turbo lint 负责）

import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'off',
      'no-debugger': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettierConfig,
);
