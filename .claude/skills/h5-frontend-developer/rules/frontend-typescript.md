---
# 限制此规范仅适用于 apps/web/src 目录下的 .ts 和 .tsx 文件
pattern: ./apps/web/src/**/*.{ts,tsx}
---

# TypeScript 开发规范

## 核心原则

- **严格模式**: 必须开启 `strict: true`，严禁在代码中关闭核心检查。
- **类型优先**: 优先定义类型（Schema），再编写逻辑。
- **零 any**: 严禁滥用 `any`，应使用 `unknown` 结合类型守卫（Type Guards）。
- **推断优先**: 简单的本地变量允许类型推断，复杂的导出函数/对象必须显式声明类型。

---

## 1. 基础类型与声明

### 类型定义 (`type` vs `interface`)
- **`interface`**:
  - 用于定义对象形状、组件 Props、API 响应结构。
  - 支持声明合并（Declaration Merging）。
- **`type`**:
  - 用于定义联合类型（Union）、交叉类型（Intersection）、元组、工具类型。
  - 适用于复杂的泛型转换。

```typescript
// ✅ 推荐使用 interface 定义组件 Props
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// ✅ 推荐使用 type 定义状态枚举（联合类型）
type Status = 'idle' | 'loading' | 'success' | 'error';
```

### 现代特性：`satisfies` (TS 4.9+)
使用 `satisfies` 可以在校验对象是否匹配类型的同时，保留对象字面量的最窄类型推断。

```typescript
const theme = {
  primary: "#007bff",
  secondary: "#6c757d"
} satisfies Record<string, string>;

// theme.primary 依然被推断为字面量 "#007bff" 而不是 string
```

### 现代特性：`const` 断言
当需要保留字面量的精确类型时，使用 `as const` 断言。

```typescript
// ✅ 推荐：让 TypeScript 推断更精确的字面量联合类型
const routeNames = ['home', 'about', 'discover'] as const;
type RouteName = typeof routeNames[number]; // 'home' | 'about' | 'discover'

// ❌ 不推荐：推断为 string[] 丢失了精确信息
const routeNames = ['home', 'about', 'discover'];
```

### 枚举（enum）规范
- **推荐**: 使用**联合类型**代替 `enum`，更灵活且 tree-shaking 友好
- **如果必须使用枚举**: 使用 `const enum` 减少运行时开销

```typescript
// ✅ 推荐：联合类型
type Status = 'idle' | 'loading' | 'success' | 'error';

// ❌ 不推荐：常规 enum
enum Status {
  Idle,
  Loading,
  Success,
  Error,
}
```

### 空值处理
- 可选属性使用 `?:`，表示这个属性可以不存在
- 可能为 `null` 必须显式声明 `T | null`，语义明确
- 禁止用 `undefined` 代替 `null`（二者语义不同：`undefined` = 未设置，`null` = 空值）
- 使用可选链 `?.` 访问嵌套属性，使用空值合并 `??` 提供默认值

```typescript
// ✅ 推荐
interface User {
  name: string;
  avatar?: string;       // 头像可以没有
  bio: string | null;    // 个人简介可以为空
}

// 使用可选链和空值合并
const displayName = user?.name ?? '匿名用户';
```

### 类型导出
所有类型导出必须使用 `export type`，便于工具优化和 tree-shaking。

```typescript
// ✅ 推荐
export type { Feature, Link };
export interface HeaderProps { }

// ❌ 不推荐
export type Feature = ...;  // 正确写法是 export type Feature = ...;（加上 type 关键词）
```

### 导入排序
导入按以下分组排序，每组之间空一行：
1. **第三方包**（React、mobx、antd-mobile 等）
2. **内部别名导入**（`@/api`、`@/components`、`@/hooks` 等）
3. **相对路径导入**（`./`、`../`）

每组内按字母顺序排列。

```typescript
// ✅ 推荐排序
import React from 'react';
import { useObserver } from 'mobx-react';
import { Button } from 'antd-mobile';

import { api } from '@/api';
import type { User } from '@/types';
import { useLoading } from '@/hooks';

import styles from './index.module.scss';
```

---

## 2. 泛型与约束 (Generics)

### 泛型约束
始终为泛型添加必要的约束，避免无意义的泛型。

```typescript
// ✅ 正确：约束 T 必须包含 id 属性
function getEntityId<T extends { id: string }>(entity: T) {
  return entity.id;
}
```

### 泛型默认值
```typescript
interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}
```

---

## 3. 异步与错误处理

### `Promise` 类型
所有异步函数必须显式标注返回值类型。

```typescript
async function fetchUser(id: string): Promise<User> {
  const res = await api.get<User>(`/user/${id}`);
  return res.data;
}
```

### 错误处理
在 `catch` 块中，`error` 默认为 `unknown`，必须进行类型收窄。

```typescript
try {
  // ...
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else if (typeof error === 'string') {
    console.error(error);
  }
}
```

---

## 4. 类型守卫与断言

### 类型守卫 (Type Guards)
优先使用 `is` 关键字编写自定义守卫函数，增强代码可读性。

```typescript
function isUser(val: unknown): val is User {
  return typeof val === 'object' && val !== null && 'uid' in val;
}

if (isUser(data)) {
  // data 此时被自动收窄为 User 类型
}
```

### 类型断言 (`as`)
- **禁止** 使用非空断言 `!`，除非你能百分之百保证其存在（如：从 Context 获取已初始化的值）。
- **禁止** 使用尖括号语法 `<Type>`，统一使用 `as Type`。

---

## 5. React 与 MobX 规范

### React 组件
- 统一使用 `React.FC<P>` 或直接声明参数类型。
- `children` 属性推荐使用 `React.ReactNode`。

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
- 字段必须显式初始化或标注类型。
- `action` 必须标注参数和返回值。
- 全局 Store 使用类 + `makeAutoObservable`，局部状态使用 `useLocalObservable`。

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

## 6. 检查清单 (Checklist)

- [ ] **严格模式**: `tsconfig.json` 是否已开启 `strict`？
- [ ] **路径别名**: 是否使用了 `@/` 而非 `../../`？
- [ ] **命名**: 接口是否以大写字母开头？（不推荐加 `I` 前缀，如 `IUser`）
- [ ] **冗余**: 是否移除了不必要的显式类型标注（如 `const count: number = 0`）？
- [ ] **文档**: 复杂的泛型工具或公共接口是否添加了 TSDoc 注释？
- [ ] **枚举**: 是否优先使用联合类型代替 `enum`？
- [ ] **空值**: 是否正确区分了可选属性 `?` 和 `T | null`？
- [ ] **导入排序**: 是否按「第三方 → 别名 → 相对」分组排序？
- [ ] **类型导出**: 类型是否都使用 `export type` 导出？

---

## 最佳实践建议

1. **利用工具类型**: 熟练使用 `Pick`, `Omit`, `Partial`, `Record` 等内置工具，避免重复定义相似结构。
2. **模板字符串类型**: 对于具有固定格式的字符串（如：颜色代码、API 路径），使用模板字符串类型进行约束。
3. **防御性编程**: 对外部输入的数据（如本地存储、API 返回），使用 Zod 进行 Schema 校验。
4. **现代特性**: 积极使用 `satisfies`、`as const` 等现代 TS 特性，获得更精确的类型推断。
