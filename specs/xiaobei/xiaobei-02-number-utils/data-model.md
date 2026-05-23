# Data Model: 小贝数字工具函数

## NumberInput

**Represents**: 工具函数接收的数字输入值。

**Fields**:

- `value`: number，调用方传入的数字。

**Validation Rules**:

- 必须是数字类型。
- 本阶段不接受字符串、空值或非数字值。
- 计算函数接收两个 NumberInput，格式化函数接收一个 NumberInput。

## CalculationResult

**Represents**: add 或 multiply 的计算结果。

**Fields**:

- `value`: number，计算后的数字结果。

**Validation Rules**:

- add 返回两项输入的数学加法结果。
- multiply 返回两项输入的数学乘法结果。
- 输入为负数、0、小数时遵循普通数字计算规则。

## FormattedNumber

**Represents**: formatNumber 返回的展示字符串。

**Fields**:

- `value`: string，用于展示的格式化数字。

**Validation Rules**:

- 返回值必须是字符串。
- 千位以上整数部分应包含千位分隔符。
- 小数部分应保留有效小数信息，不进行额外截断或四舍五入。
- 负数应保留负号并格式化其数值部分。

## Relationships

- `add` 使用两个 NumberInput 生成一个 CalculationResult。
- `multiply` 使用两个 NumberInput 生成一个 CalculationResult。
- `formatNumber` 使用一个 NumberInput 生成一个 FormattedNumber。

## State Transitions

无状态转换。所有数字工具函数均为同步纯函数，不保存内部状态，不修改输入，不产生副作用。
