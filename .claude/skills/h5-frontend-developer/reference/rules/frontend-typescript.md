---
# 限制此规范仅适用于 apps/web/src 目录下的 .ts 和 .tsx 文件
pattern: ./apps/web/src/**/*.{ts,tsx}
---

# 前端 TypeScript 规范（React 特有）

> **通用 TypeScript 规范**：已抽离至 `.claude/rules/typescript-common.md`，本文件仅定义前端特有规范。

---

## 核心原则补充

- **严格模式**: 必须开启 `strict: true`（通用规范已定义）
- **零 any**: 严禁滥用 `any`，应使用 `unknown` 结合类型守卫（通用规范已定义）
- **类型优先**: 先定义类型，再编写逻辑（通用规范已定义）
- **推断优先**: 简单本地变量允许类型推断，复杂导出函数/对象必须显式声明类型

---

## 1. 类型定义规范

### `interface` vs `type` 选择

| 场景 | 使用 | 说明 |
|------|------|------|
| 组件 Props | `interface` | 支持声明合并，便于扩展 |
| API 响应结构 | `interface` | 前后端契约，易于维护 |
| 状态枚举 | `type`（联合类型） | tree-shaking 友好，更灵活 |
| 工具类型 | `type` | 联合、交叉、元组等复杂转换 |

```typescript
// ✅ 推荐：interface 定义组件 Props
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// ✅ 推荐：type 定义联合类型（代替 enum）
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### 禁止使用常规 enum

- ✅ **推荐**: 使用**联合类型**代替 `enum`，更灵活且 tree-shaking 友好
- ⚠️ **如必须使用枚举**: 使用 `const enum` 减少运行时开销
- ❌ **禁止**: 使用常规 `enum`

### 现代特性推荐

- ✅ 使用 `satisfies`（TS 4.9+）：保留字面量最窄类型推断
- ✅ 使用 `as const`：精确类型断言，获取字面量联合类型

```typescript
// satisfies 示例
const theme = {
  primary: '#007bff',
  secondary: '#6c757d',
} satisfies Record<string, string>;

// as const 示例
const routeNames = ['home', 'about', 'discover'] as const;
type RouteName = typeof routeNames[number]; // 'home' | 'about' | 'discover'
```

---

## 2. 导入排序（前端特有）

导入按以下分组排序，每组之间空一行。同一组内按字母顺序排列。

| 顺序 | 分组 | 示例 |
|------|------|------|
| 1 | React 相关 | `react`、`react-dom` |
| 2 | 状态管理 | `mobx`、`mobx-react` |
| 3 | UI 组件库 | `antd-mobile` |
| 4 | 其他第三方包 | `axios`、`dayjs` 等 |
| 5 | 内部别名导入 | `@/api`、`@/components`、`@/hooks` 等 |
| 6 | 相对路径导入 | `./`、`../`、样式文件 |

```typescript
// ✅ 推荐排序
import React, { useState, useEffect } from 'react';

import { useObserver } from 'mobx-react';

import { Button, Toast } from 'antd-mobile';

import axios from 'axios';
import dayjs from 'dayjs';

import { api } from '@/api';
import type { User } from '@/types';
import { useLoading } from '@/hooks';
import { formatDate } from '@/utils';

import styles from './index.module.scss';
```

---

## 3. React 与 MobX 规范

### React 组件

- 统一使用 `React.FC<P>` 或直接声明参数类型
- `children` 属性推荐使用 `React.ReactNode`

```typescript
interface LayoutProps {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return <main title={title}>{children}</main>;
};
```

### MobX Store

- 字段必须显式初始化或标注类型
- `action` 必须标注参数和返回值
- 全局 Store 使用类 + `makeAutoObservable`
- 局部状态使用 `useLocalObservable`

```typescript
// ✅ 全局 Store
class UIStore {
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading = (state: boolean): void => {
    this.loading = state;
  };
}

// ✅ 局部页面/组件级 Store（本项目常用）
import { useLocalObservable } from 'mobx-react';

const useAboutStore = () => {
  const store = useLocalObservable<AboutStoreType>(() => ({
    appName: 'Discover',
    features: [],
    // ...
  }));

  return store;
};
```

---

## 4. 前端特有检查清单

- [ ] **路径别名**: 是否使用了 `@/` 而非 `../../`？
- [ ] **命名**: 接口是否以大写字母开头？（不推荐加 `I` 前缀，如 `IUser`）
- [ ] **冗余**: 是否移除了不必要的显式类型标注（如 `const count: number = 0`）？
- [ ] **文档**: 复杂的泛型工具或公共接口是否添加了 TSDoc 注释？
- [ ] **React**: 组件 Props 是否使用 `interface` 定义？
- [ ] **MobX**: Store 字段是否有显式类型？

---

## 最佳实践建议

1. **利用工具类型**: 熟练使用 `Pick`, `Omit`, `Partial`, `Record` 等内置工具，避免重复定义相似结构。
2. **模板字符串类型**: 对于具有固定格式的字符串（如：颜色代码、API 路径），使用模板字符串类型进行约束。
3. **防御性编程**: 对外部输入的数据（如本地存储、API 返回），使用 Zod 进行 Schema 校验。
4. **现代特性**: 积极使用 `satisfies`、`as const` 等现代 TS 特性，获得更精确的类型推断。
