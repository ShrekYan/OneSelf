/**
 * ESLint Plugin: Claude Architecture Rules
 *
 * 本插件将 DECISIONS.md 中的架构决策转化为可执行的 ESLint 规则。
 *
 * 规则清单：
 * - adr-002-no-jwt-in-backend: backend 服务禁止引入 jsonwebtoken
 * - adr-003-no-localstorage-token: 禁止使用 localStorage 存储 Token
 * - adr-004-no-bcrypt-new-password: 禁止使用 bcrypt 哈希新密码
 * - adr-006-no-prisma-as-any: 禁止使用 (prisma as any)
 * - fadr-003-no-mobx-observer-hoc: 禁止使用 observer() HOC
 *
 * 维护者：每次新增架构决策时，在此添加对应 ESLint 规则
 */

import adr002 from './rules/adr-002-no-jwt-in-backend.js';
import adr003 from './rules/adr-003-no-localstorage-token.js';
import adr004 from './rules/adr-004-no-bcrypt-new-password.js';
import adr006 from './rules/adr-006-no-prisma-as-any.js';
import fadr003 from './rules/fadr-003-no-mobx-observer-hoc.js';

export default {
  rules: {
    'adr-002-no-jwt-in-backend': adr002,
    'adr-003-no-localstorage-token': adr003,
    'adr-004-no-bcrypt-new-password': adr004,
    'adr-006-no-prisma-as-any': adr006,
    'fadr-003-no-mobx-observer-hoc': fadr003,
  },
  configs: {
    recommended: {
      plugins: ['@claude/architecture'],
      rules: {
        '@claude/architecture/adr-002-no-jwt-in-backend': 'error',
        '@claude/architecture/adr-003-no-localstorage-token': 'error',
        '@claude/architecture/adr-004-no-bcrypt-new-password': 'error',
        '@claude/architecture/adr-006-no-prisma-as-any': 'error',
        '@claude/architecture/fadr-003-no-mobx-observer-hoc': 'error',
      },
    },
  },
};
