# Implementation Plan: 数组工具

**所属 Feature**: 小贝工具库 (`specs/002-xiaobei-utils`)

**Stage ID**: 03-array-utils

**Spec**: [spec.md](spec.md)

## Summary

本阶段计划在 `apps/web/src/utils/array.ts` 中交付三个数组工具函数：`unique(arr)`、`sort(arr)`、`filter(arr, fn)`，提供完整类型声明和清晰行为边界。

## Technical Context

**Language/Version**: TypeScript 5.5.3

**Primary Dependencies**: 使用 JavaScript 原生数组能力，无新增外部依赖。

**Testing**: 不规划单元测试交付；验收以功能契约、类型声明和行为边界说明为准。

**Target File**: `apps/web/src/utils/array.ts`

## Design Decisions

### 决策：数组去重采用浅层唯一性规则

`unique(arr)` 规划为对数组元素进行浅层去重，保留首次出现的唯一值。

**Rationale**: 来源需求是"数组去重"，且不包含深度对象去重。浅层去重简单、可预测，适合作为基础工具能力。

**Alternatives considered**:

- 深度对象去重：不采纳，spec 明确不包含。
- 自定义 key 去重：不采纳，超出当前来源需求。

### 决策：数组排序采用默认升序规则

`sort(arr)` 规划为返回默认升序排列结果，并避免修改调用方原数组。

**Rationale**: 默认升序是最常见、最易验收的基础排序规则；避免原地修改可减少副作用。

**Alternatives considered**:

- 自定义复杂比较器：不采纳，spec 明确不包含。
- 多字段排序：不采纳，超出当前来源需求。
- 原地排序：不采纳，可能给调用方带来副作用。

### 决策：数组过滤透传同步 predicate

`filter(arr, fn)` 规划为接收数组和同步过滤函数，返回满足条件的元素集合。

**Rationale**: 来源需求是"数组过滤"，spec 明确不包含异步过滤能力。同步 predicate 与基础数组过滤语义一致，易于测试和理解。

**Alternatives considered**:

- 异步过滤：不采纳，spec 明确不包含。
- 链式集合操作：不采纳，超出当前来源需求。

## Source Code Target

```text
apps/web/src/utils/
└── array.ts                # 数组工具函数：unique / sort / filter
```

## Constraints

- 仅交付 `unique(arr)`、`sort(arr)`、`filter(arr, fn)` 三个工具函数。
- 不引入外部依赖。
- 不扩展到深度对象去重、复杂比较器、多字段排序、异步过滤、链式集合或流式处理能力。
- 不创建独立包或额外目录。

## Validation

- 检查 `apps/web/src/utils/array.ts` 导出是否与 `contract.md` 一致。
- 确认完整类型声明。
- 确认不修改输入数组。
- 运行 `npm run lint` 和 `npx tsc --noEmit` 验证。
