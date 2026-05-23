# Contract: String Utilities

## Scope

本契约定义小贝字符串工具函数的公开行为。实现应提供 3 个主字符串处理入口和 3 个备份字符串处理入口。

## Primary Utilities

### trim

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 返回去除首尾空白字符后的字符串；中间空白字符保持不变。
- **Examples**:
  - `" hello "` -> `"hello"`
  - `"a b"` -> `"a b"`
  - `"   "` -> `""`

### uppercase

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 返回可转换字符转为大写后的字符串。
- **Examples**:
  - `"abc"` -> `"ABC"`
  - `"AbC 123"` -> `"ABC 123"`

### lowercase

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 返回可转换字符转为小写后的字符串。
- **Examples**:
  - `"ABC"` -> `"abc"`
  - `"AbC 123"` -> `"abc 123"`

## Backup Utilities

### backupTrim

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 与主 `trim` 行为一致。

### backupUppercase

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 与主 `uppercase` 行为一致。

### backupLowercase

- **Input**: `string`
- **Output**: `string`
- **Behavior**: 与主 `lowercase` 行为一致。

## Invariants

- 所有入口必须返回字符串。
- 所有入口必须是确定性的。
- 所有入口不得产生副作用。
- 备份入口与对应主入口在相同输入下应返回相同结果。
- 本阶段不要求新增或运行单元测试；验证以契约核对、TypeScript 类型检查和 lint 为准。
