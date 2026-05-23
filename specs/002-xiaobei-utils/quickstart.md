# Quickstart: 小贝工具库

**Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

## Overview

本文件为全局 quickstart 索引，汇总小贝工具库的使用方式和验证方法。详细的阶段使用示例请参考各阶段文档。

## Import Paths

小贝工具库的工具函数位于 `apps/web/src/utils/` 目录下：

- 字符串工具：`@/utils/string`
- 数字工具：`@/utils/number`
- 数组工具：`@/utils/array`

## Stage Quickstart References

| Stage ID | Stage Name | Stage Quickstart                                                             |
| -------- | ---------- | ---------------------------------------------------------------------------- |
| 01       | 字符串工具 | [stages/01-string-utils/quickstart.md](stages/01-string-utils/quickstart.md) |
| 02       | 数字工具   | [stages/02-number-utils/quickstart.md](stages/02-number-utils/quickstart.md) |
| 03       | 数组工具   | [stages/03-array-utils/quickstart.md](stages/03-array-utils/quickstart.md)   |

## Global Validation

### Suggested Local Checks

在前端项目目录执行以下命令验证实现：

```bash
cd apps/web/
npm run lint
npx tsc --noEmit
```

### Validation Summary

- **代码质量**: 通过 `npm run lint` 检查代码风格和潜在问题
- **类型安全**: 通过 `npx tsc --noEmit` 验证 TypeScript 类型声明
- **无单元测试**: 根据用户澄清，本 feature 不包含单元测试交付要求
- **契约对齐**: 每个阶段实现应与其 `contract.md` 文档保持一致

## Feature Scope

本 feature 包含以下工具能力：

| Category   | Functions                         |
| ---------- | --------------------------------- |
| 字符串工具 | `trim`, `uppercase`, `lowercase`  |
| 数字工具   | `add`, `multiply`, `formatNumber` |
| 数组工具   | `unique`, `sort`, `filter`        |

所有工具函数均提供完整的 TypeScript 类型声明，并保持单一职责和可预测行为。
