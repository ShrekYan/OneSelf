# Data Model: 数组工具

**所属 Feature**: 小贝工具库

**Stage ID**: 03-array-utils

## Overview

本阶段不涉及持久化数据模型。这里描述数组工具集合的输入、输出、质量要求和能力契约模型。

## Entities

### ArrayToolCollection

**Description**: 数组工具集合，表示本阶段需要交付的一组基础数组处理能力。

**Fields**:

- `name`: 固定为"数组工具"。
- `functions`: 包含 `unique`、`sort`、`filter` 三个工具函数。
- `scope`: 仅包含数组去重、默认排序、同步过滤。
- `outOfScope`: 不包含深度对象去重、自定义复杂比较器、多字段排序、异步过滤、链式集合操作、惰性求值、流式处理、非数组集合类型处理等能力。
- `qualityRequirement`: 当前仅要求类型声明完整、输入输出清晰、行为边界明确。

**Validation Rules**:

- 必须恰好包含三个指定函数。
- 不得加入来源文档未声明的额外数组工具。
- 每个函数必须具备明确输入类型和返回类型。
- 不包含单元测试交付要求。

### ArrayUtilityFunction

**Description**: 单个数组工具函数。

**Fields**:

- `functionName`: 工具函数名称，取值为 `unique`、`sort`、`filter`。
- `input`: 待处理数组值及必要参数。
- `output`: 处理后的数组结果。
- `behavior`: 函数处理规则。

**Validation Rules**:

- `unique` 必须返回去重后的数组，并保留唯一元素集合。
- `sort` 必须返回按默认规则排序后的数组。
- `filter` 必须返回满足同步过滤条件的元素集合。
- 输出必须为数组。
- 空数组、无匹配结果、重复元素、乱序元素需要保持可预测行为。
- 数组工具不应修改调用方传入的原数组。

## State Transitions

数组工具函数均为纯处理能力，不维护状态，无状态迁移。
