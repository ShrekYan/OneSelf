# Data Model: 小贝字符串工具函数

## Entity: String Input

**Description**: 调用字符串处理能力时传入的文本值。

**Fields**:

- `value`: string，待处理文本。

**Validation Rules**:

- 当前规格范围限定为 string。
- 空字符串是有效输入。
- 仅包含空白字符的字符串是有效输入。

## Entity: String Output

**Description**: 完成单个字符串转换后得到的文本值。

**Fields**:

- `value`: string，处理后的文本。

**Validation Rules**:

- 输出始终为 string。
- 相同输入和相同转换能力必须得到相同输出。
- 转换过程不得修改输入值本身。

## Entity: Primary String Utility

**Description**: 主字符串处理能力集合。

**Capabilities**:

- `trim`: 去除首尾空白字符，保留中间内容。
- `uppercase`: 将可转换字符转为大写。
- `lowercase`: 将可转换字符转为小写。

**Relationships**:

- 接收 String Input。
- 产生 String Output。
- 与 Backup String Utility 对应能力保持行为一致。

## Entity: Backup String Utility

**Description**: 备份字符串处理能力集合，用于提供与主能力一致的备用入口。

**Capabilities**:

- `backupTrim`: 与主 `trim` 行为一致。
- `backupUppercase`: 与主 `uppercase` 行为一致。
- `backupLowercase`: 与主 `lowercase` 行为一致。

**Relationships**:

- 接收 String Input。
- 产生 String Output。
- 对应每个 Primary String Utility 能力。

## State Transitions

本功能无状态转换。所有能力均为纯字符串转换：

```text
String Input -> selected transformation -> String Output
```
