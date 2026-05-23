# Implementation Plan: 数字工具

**所属 Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

**Stage ID**: 02-number-utils

**Spec**: [spec.md](spec.md)

## Summary

本阶段计划在 `apps/web/src/utils/number.ts` 中交付三个数字工具函数：`add(a, b)`、`multiply(a, b)`、`formatNumber(num)`，提供完整类型声明和清晰行为边界。

## Technical Context

**Language/Version**: TypeScript 5.5.3

**Primary Dependencies**: 使用 JavaScript 原生数字运算与数字格式化能力，无新增外部依赖。

**Testing**: 不规划单元测试交付；验收以功能契约、类型声明和行为边界说明为准。

**Target File**: `apps/web/src/utils/number.ts`

## Design Decisions

### 决策：数字运算保持基础 number 语义

`add` 与 `multiply` 接收数字输入并返回数字结果，遵循 JavaScript 基础 number 运算语义。

**Rationale**: 来源需求是"简单的数字工具函数"，不包含金融精度、大数、任意精度或单位换算能力。保持基础 number 语义能满足最小范围原则。

**Alternatives considered**:

- 引入任意精度或金融精度处理：不采纳，超出不包含范围。
- 支持字符串数字自动转换：不采纳，容易引入隐式转换歧义，且来源需求未声明。

### 决策：数字格式化采用统一、轻量的默认展示规则

`formatNumber(num)` 规划为将数字转换为统一展示字符串；默认规则使用千分位展示作为基础格式。

**Rationale**: 千分位是常见数字展示默认值，适合作为简单数字格式化的可预测规则。

**Alternatives considered**:

- 本地化数字格式：不采纳，spec 明确不包含本地化数字格式策略。
- 多币种/单位格式：不采纳，超出不包含范围。
- 返回 number：不采纳，"格式化数字显示"更适合返回展示字符串。

## Source Code Target

```text
apps/web/src/utils/
└── number.ts               # 数字工具函数：add / multiply / formatNumber
```

## Constraints

- 仅交付 `add(a, b)`、`multiply(a, b)`、`formatNumber(num)` 三个工具函数。
- 不引入外部依赖。
- 不扩展到复杂数学、金融精度、本地化格式或大数计算能力。
- 不创建独立包或额外目录。

## Validation

- 检查 `apps/web/src/utils/number.ts` 导出是否与 `contract.md` 一致。
- 确认完整类型声明。
- 运行 `npm run lint` 和 `npx tsc --noEmit` 验证。
