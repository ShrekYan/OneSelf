# Contract: Number Utilities

## Scope

本契约定义小贝数字工具函数的公开行为。实现应提供 3 个数字处理入口：`add`、`multiply`、`formatNumber`。

## Utilities

### add

- **Input**: `(a: number, b: number)`
- **Output**: `number`
- **Behavior**: 返回两个数字的数学加法结果。
- **Examples**:
  - `add(1, 2)` -> `3`
  - `add(-1, 2)` -> `1`
  - `add(1.5, 2)` -> `3.5`

### multiply

- **Input**: `(a: number, b: number)`
- **Output**: `number`
- **Behavior**: 返回两个数字的数学乘法结果。
- **Examples**:
  - `multiply(2, 3)` -> `6`
  - `multiply(-2, 3)` -> `-6`
  - `multiply(0, 99)` -> `0`

### formatNumber

- **Input**: `(num: number)`
- **Output**: `string`
- **Behavior**: 返回带千位分隔符的数字展示字符串，并保留有效小数信息。
- **Examples**:
  - `formatNumber(123)` -> `"123"`
  - `formatNumber(12345)` -> `"12,345"`
  - `formatNumber(12345.67)` -> `"12,345.67"`
  - `formatNumber(-12345.67)` -> `"-12,345.67"`

## Invariants

- 所有入口必须是确定性的。
- 所有入口不得产生副作用。
- 所有入口必须提供显式参数类型和返回类型。
- 输入范围限定为 number，不负责处理字符串、空值或非数字值。
- 本阶段不要求新增或运行单元测试；验证以契约核对、TypeScript 类型检查和 lint 为准。
