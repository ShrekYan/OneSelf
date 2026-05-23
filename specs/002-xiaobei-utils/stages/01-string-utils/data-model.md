# Data Model: 字符串工具

**所属 Feature**: 小贝工具库

**Stage ID**: 01-string-utils

## Overview

本阶段不涉及持久化数据模型。这里描述字符串工具集合的输入、输出、质量要求和能力契约模型。

## Entities

### StringToolCollection

**Description**: 字符串工具集合，表示本阶段需要交付的一组基础字符串处理能力。

**Fields**:

- `name`: 固定为"字符串工具"。
- `functions`: 包含 `trim`、`uppercase`、`lowercase` 三个工具函数。
- `scope`: 仅包含去除首尾空白、转大写、转小写。
- `outOfScope`: 不包含截断、替换、模板格式化、脱敏、国际化文案转换、语言检测、复杂 Unicode 规范化等能力。
- `qualityRequirement`: 当前仅要求类型声明完整、输入输出清晰、行为边界明确。

**Validation Rules**:

- 必须恰好包含三个指定函数。
- 不得加入来源文档未声明的额外字符串工具。
- 每个函数必须具备明确输入类型和返回类型。
- 每个函数必须保持单一职责。

### StringUtilityFunction

**Description**: 单个字符串工具函数。

**Fields**:

- `functionName`: 工具函数名称，取值为 `trim`、`uppercase`、`lowercase`。
- `input`: 待处理字符串值。
- `output`: 处理后的字符串结果。
- `behavior`: 函数处理规则。

**Validation Rules**:

- `trim` 必须返回去除首尾空白后的字符串，并保留中间内容。
- `uppercase` 必须返回大写形式字符串。
- `lowercase` 必须返回小写形式字符串。
- 输出必须为字符串。
- 空字符串、仅空白字符串、包含数字或符号的字符串需要保持可预测行为。

## State Transitions

字符串工具函数均为纯处理能力，不维护状态，无状态迁移。
