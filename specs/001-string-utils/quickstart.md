# Quickstart: 字符串工具函数

**Feature**: 前端字符串工具函数
**Date**: 2026-05-16

## 安装

无需安装，工具函数已内置于项目 `apps/web/src/utils/string.ts`。

## 使用示例

### 导入

```typescript
import { trim, uppercase, lowercase } from '@/utils/string';
```

### trim - 去除首尾空格

```typescript
import { trim } from '@/utils/string';

// 去除首尾空格
trim('  hello world  '); // => 'hello world'

// 无空格时返回原字符串
trim('hello world'); // => 'hello world'

// 空字符串
trim(''); // => ''

// 仅含空格
trim('   '); // => ''

// null / undefined 安全处理
trim(null); // => ''
trim(undefined); // => ''
```

### uppercase - 转为大写

```typescript
import { uppercase } from '@/utils/string';

uppercase('Hello World'); // => 'HELLO WORLD'
uppercase('abc123'); // => 'ABC123'
uppercase(''); // => ''

// null / undefined 安全处理
uppercase(null); // => ''
uppercase(undefined); // => ''
```

### lowercase - 转为小写

```typescript
import { lowercase } from '@/utils/string';

lowercase('Hello World'); // => 'hello world'
lowercase('ABC123'); // => 'abc123'
lowercase(''); // => ''

// null / undefined 安全处理
lowercase(null); // => ''
lowercase(undefined); // => ''
```

## 类型提示

所有函数均有完整的 TypeScript 类型声明：

```typescript
function trim(str: string | null | undefined): string;
function uppercase(str: string | null | undefined): string;
function lowercase(str: string | null | undefined): string;
```

IDE 将自动提供参数类型和返回值类型提示。参数允许传入 `null` / `undefined`，返回值始终为 `string`。
