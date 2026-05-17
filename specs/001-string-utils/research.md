# Research: 前端字符串工具函数实现方案

**Feature**: 前端字符串工具函数
**Date**: 2026-05-16

## 研究问题

1. TypeScript 字符串工具函数的最佳实现方式
2. 与现有项目代码风格的兼容性
3. `null` / `undefined` 空值安全处理的最佳实践

## 研究发现

### 1. 实现方式选择

**决策**: 直接使用 JavaScript 原生 `String.prototype` 方法封装

**理由**:

- `trim()`、`toUpperCase()`、`toLowerCase()` 均为 ES5+ 标准方法，浏览器兼容性极佳
- 无需引入 lodash、ramda 等第三方库，保持零依赖
- 原生方法经浏览器引擎高度优化，性能最优
- 项目现有 utils 模块均为零依赖设计（security.ts、secure-storage.ts 均未引入外部包）

**替代方案考虑**:

- lodash `trim` / `upperCase` / `lowerCase`：功能冗余，增加包体积，拒绝
- 自定义正则实现：代码冗余，无性能优势，拒绝

### 2. 类型声明策略

**决策**: 显式函数声明 + JSDoc 注释

**理由**:

- 项目规范要求 "所有函数必须有显式、完整的类型声明"
- 现有 `security.ts` 使用 `export function fnName(param: string): string` 风格
- 本次调整为 `string | null | undefined` 参数类型，返回值始终为 `string`，符合防御式编程原则
- JSDoc 注释提供 IDE 提示和自动生成文档能力

### 3. 空值安全处理策略

**决策**: 函数内部使用 `str ?? ''`（空值合并运算符）做前置保护

**理由**:

- `??` 仅对 `null` 和 `undefined` 生效，不会误处理空字符串 `''` 或数字 `0`
- 相比 `||` 更安全，避免 falsy 值被错误替换
- 代码简洁：`(str ?? '').trim()` 等即可实现安全调用
- TypeScript 严格模式下，`??` 是处理 nullable 值的标准做法

**替代方案考虑**:

- `str || ''`：会错误地将空字符串、0、false 也替换，拒绝
- 提前 throw Error：与 spec 要求的"返回空字符串"冲突，拒绝

### 4. 导出方式

**决策**: 命名导出（named export）

**理由**:

- 与现有 utils 模块一致（`security.ts` 使用 `export function`）
- 便于 tree-shaking，按需引用
- 支持单独导入：`import { trim } from '@/utils/string'`

## 结论

实现方案已明确：零依赖、原生方法封装、参数支持 `string | null | undefined`、内部用 `??` 做空值保护、命名导出、完整类型声明。无未澄清项，可直接进入设计阶段。本特性不包含单元测试（已通过 `/speckit-clarify` 确认），无额外验收步骤。
