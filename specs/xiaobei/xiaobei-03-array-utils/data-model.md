# Data Model: 小贝数组工具函数

## ArrayInput

**Represents**: 工具函数接收的数组输入值。

**Fields**:

- `items`: readonly array，调用方传入的数组元素集合。

**Validation Rules**:

- 必须是数组类型。
- 元素类型由调用方输入决定，返回结果应保持相同元素类型。
- 本阶段不接受非数组输入、空值或自动类型转换。

## UniqueResult

**Represents**: unique 返回的去重结果。

**Fields**:

- `items`: array，去除重复值后的数组。

**Validation Rules**:

- 返回值必须是数组。
- 重复识别基于标准值身份，适用于简单数组。
- 结果中每个值只保留一次。
- 结果保持元素首次出现的顺序。
- 不修改输入数组。

## SortResult

**Represents**: sort 返回的排序结果。

**Fields**:

- `items`: array，排序后的数组。

**Validation Rules**:

- 返回值必须是数组。
- 数字数组按数字升序排列。
- 字符串数组按默认字典顺序排列。
- 空数组返回空数组。
- 不修改输入数组。

## FilterCondition

**Represents**: filter 接收的过滤条件。

**Fields**:

- `predicate`: function，接收当前元素并返回是否保留该元素。

**Validation Rules**:

- 条件函数必须返回布尔结果。
- 每个元素按输入顺序进行条件判断。
- 本阶段不支持异步条件函数。

## FilterResult

**Represents**: filter 返回的过滤结果。

**Fields**:

- `items`: array，满足条件的数组元素集合。

**Validation Rules**:

- 返回值必须是数组。
- 只包含过滤条件返回 true 的元素。
- 若没有元素满足条件，返回空数组。
- 保持满足条件元素在输入数组中的相对顺序。
- 不修改输入数组。

## Relationships

- `unique` 使用一个 ArrayInput 生成一个 UniqueResult。
- `sort` 使用一个 ArrayInput 生成一个 SortResult。
- `filter` 使用一个 ArrayInput 和一个 FilterCondition 生成一个 FilterResult。

## State Transitions

无状态转换。所有数组工具函数均为同步纯函数，不保存内部状态，不修改输入数组，不产生副作用。
