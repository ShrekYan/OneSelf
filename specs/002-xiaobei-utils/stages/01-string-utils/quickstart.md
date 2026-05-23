# Quickstart: 字符串工具

**所属 Feature**: 小贝工具库

**Stage ID**: 01-string-utils

## Scope

本 quickstart 用于字符串工具阶段的验收。

## Expected String Utilities

字符串工具集合应包含：

- `trim(str)`：去除字符串首尾空白。
- `uppercase(str)`：将字符串转为大写。
- `lowercase(str)`：将字符串转为小写。

## Usage Examples

```typescript
import { lowercase, trim, uppercase } from '@/utils/string';

trim('  hello  '); // 'hello'
uppercase('hello'); // 'HELLO'
lowercase('HELLO'); // 'hello'
```

## Validation Checklist

- 字符串工具集合只包含指定的 3 个能力。
- 每个字符串工具函数都有明确输入类型和返回类型。
- `trim()` 能处理普通字符串、首尾空白字符串、仅空白字符串、空字符串。
- `uppercase()` 能处理普通字母字符串、混合大小写字符串、包含数字或符号的字符串。
- `lowercase()` 能处理普通字母字符串、混合大小写字符串、包含数字或符号的字符串。
- 字符串工具不引入来源文档未声明的额外能力。

## Suggested Local Checks

在前端项目目录执行：

```bash
npm run lint
npx tsc --noEmit
```
