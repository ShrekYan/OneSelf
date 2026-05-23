# Implementation Plan: 字符串工具

**所属 Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

**Stage ID**: 01-string-utils

**Spec**: [spec.md](spec.md)

## Summary

本阶段计划在 `apps/web/src/utils/string.ts` 中交付三个字符串工具函数：`trim()`、`uppercase()`、`lowercase()`，提供完整类型声明。

## Technical Context

**Language/Version**: TypeScript 5.5.3

**Primary Dependencies**: 使用 JavaScript 原生字符串能力，无新增外部依赖。

**Testing**: 不规划单元测试交付；验收以功能契约、类型声明和行为边界说明为准。

**Target File**: `apps/web/src/utils/string.ts`

## Design Decisions

### 决策：字符串工具采用原生字符串语义

`trim`、`uppercase`、`lowercase` 使用 JavaScript 原生字符串处理语义，并保持输入输出类型明确。

**Rationale**: 来源需求是基础字符串工具，不包含复杂 Unicode 规范化、国际化语言转换或模板格式化能力。原生字符串语义简单、稳定、可预测。

**Alternatives considered**:

- 引入国际化大小写策略：不采纳，超出不包含范围。
- 支持复杂 Unicode 规范化：不采纳，来源需求未声明。
- 添加更多字符串工具：不采纳，违反最小范围原则。

## Source Code Target

```text
apps/web/src/utils/
└── string.ts               # 字符串工具函数：trim / uppercase / lowercase
```

## Constraints

- 仅交付 `trim()`、`uppercase()`、`lowercase()` 三个工具函数。
- 不引入外部依赖。
- 不扩展到复杂字符串处理能力。
- 不创建独立包或额外目录。

## Validation

- 检查 `apps/web/src/utils/string.ts` 导出是否与 `contract.md` 一致。
- 确认完整类型声明。
- 运行 `npm run lint` 和 `npx tsc --noEmit` 验证。
