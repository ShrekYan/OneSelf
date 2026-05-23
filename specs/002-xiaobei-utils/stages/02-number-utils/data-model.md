# Data Model: 数字工具

**所属 Feature**: 小贝工具库

**Stage ID**: 02-number-utils

## Overview

本阶段不涉及持久化数据模型。这里描述数字工具集合的输入、输出、质量要求和能力契约模型。

## Entities

### NumberToolCollection

**Description**: 数字工具集合，表示本阶段需要交付的一组基础数字处理能力。

**Fields**:

- `name`: 固定为"数字工具"。
- `functions`: 包含 `add`、`multiply`、`formatNumber` 三个工具函数。
- `scope`: 仅包含两数相加、两数相乘、数字格式化展示。
- `outOfScope`: 不包含除法、取模、幂运算、统计聚合、金融精度、多币种、单位换算、本地化数字格式、大数计算等能力。
- `qualityRequirement`: 当前仅要求类型声明完整、输入输出清晰、行为边界明确。

**Validation Rules**:

- 必须恰好包含三个指定函数。
- 不得加入来源文档未声明的额外数字工具。
- 每个函数必须具备明确输入类型和返回类型。
- 不包含单元测试交付要求。

### NumberUtilityFunction

**Description**: 单个数字工具函数。

**Fields**:

- `functionName`: 工具函数名称，取值为 `add`、`multiply`、`formatNumber`。
- `input`: 待处理数字值或数字参数组。
- `output`: 运算结果或格式化后的展示结果。
- `behavior`: 函数处理规则。

**Validation Rules**:

- `add` 必须返回两个数字输入的和。
- `multiply` 必须返回两个数字输入的乘积。
- `formatNumber` 必须返回统一、可预测的数字展示字符串。
- `add` 与 `multiply` 的输出为数字。
- `formatNumber` 的输出为字符串。
- 对零、负数、小数、较大数字需要保持可预测行为。

## State Transitions

数字工具函数均为纯处理能力，不维护状态，无状态迁移。
