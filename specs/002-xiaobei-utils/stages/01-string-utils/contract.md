# Contract: String Utilities

**所属 Feature**: 小贝工具库

**Stage ID**: 01-string-utils

## Scope

本契约覆盖字符串工具阶段，包括：

- `trim()`
- `uppercase()`
- `lowercase()`

## Public Capabilities

### trim

**Purpose**: 去除字符串首尾空白字符。

**Input**:

- 待处理字符串值。
- 可接受空值安全处理。

**Output**:

- 返回字符串。
- 首尾空白被移除。
- 中间内容保持不变。

**Examples**:

- 输入：`"  hello world  "` → 输出：`"hello world"`
- 输入：`"hello world"` → 输出：`"hello world"`
- 输入：`"   "` → 输出：`""`

### uppercase

**Purpose**: 将字符串转换为大写形式。

**Input**:

- 待处理字符串值。
- 可接受空值安全处理。

**Output**:

- 返回字符串。
- 字母字符转换为大写。
- 数字和符号保持可预测行为。

**Examples**:

- 输入：`"Hello World"` → 输出：`"HELLO WORLD"`
- 输入：`"abc123"` → 输出：`"ABC123"`
- 输入：`""` → 输出：`""`

### lowercase

**Purpose**: 将字符串转换为小写形式。

**Input**:

- 待处理字符串值。
- 可接受空值安全处理。

**Output**:

- 返回字符串。
- 字母字符转换为小写。
- 数字和符号保持可预测行为。

**Examples**:

- 输入：`"Hello World"` → 输出：`"hello world"`
- 输入：`"ABC123"` → 输出：`"abc123"`
- 输入：`""` → 输出：`""`

## Quality Requirements

- 三个函数必须具备完整类型声明。
- 三个函数必须保持单一职责。
- 三个函数不应引入副作用。
- 本契约不包含单元测试交付要求。

## Source Reference

`apps/web/src/utils/string.ts`
