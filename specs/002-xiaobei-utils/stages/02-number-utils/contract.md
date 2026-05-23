# Contract: Number Utilities

**所属 Feature**: 小贝工具库

**Stage ID**: 02-number-utils

## Scope

本契约覆盖数字工具阶段，包括：

- `add(a, b)`
- `multiply(a, b)`
- `formatNumber(num)`

## Public Capabilities

### add

**Purpose**: 计算两个数字的和。

**Input**:

- `a`: 第一个数字。
- `b`: 第二个数字。

**Output**:

- 返回数字。
- 结果为 `a` 与 `b` 的和。

**Examples**:

- 输入：`1, 2` → 输出：`3`
- 输入：`0, 5` → 输出：`5`
- 输入：`-1, 2` → 输出：`1`

### multiply

**Purpose**: 计算两个数字的乘积。

**Input**:

- `a`: 第一个数字。
- `b`: 第二个数字。

**Output**:

- 返回数字。
- 结果为 `a` 与 `b` 的乘积。

**Examples**:

- 输入：`2, 3` → 输出：`6`
- 输入：`0, 5` → 输出：`0`
- 输入：`-2, 3` → 输出：`-6`

### formatNumber

**Purpose**: 以统一方式格式化数字显示。

**Input**:

- `num`: 待格式化数字。

**Output**:

- 返回字符串。
- 结果为统一、可预测的数字展示格式。
- 默认采用千分位展示规则。

**Examples**:

- 输入：`1000` → 输出：`"1,000"`
- 输入：`1234567` → 输出：`"1,234,567"`
- 输入：`12.5` → 输出：`"12.5"`

## Quality Requirements

- 三个函数必须具备完整类型声明。
- 三个函数必须保持单一职责。
- 三个函数不应引入副作用。
- 本契约不包含单元测试交付要求。
- 不引入复杂数学、金融精度、本地化格式或大数计算能力。

## Source Reference

`apps/web/src/utils/number.ts`
