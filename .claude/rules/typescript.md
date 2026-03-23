---
# 限制此规范仅适用于 src 目录下的 .ts 和 .tsx 文件
pattern: ./src/**/*.{ts,tsx}
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

// ✅ 推荐使用 type 定义状态枚举
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

```typescript
class UIStore {
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading = (state: boolean): void => {
    this.loading = state;
  }
}
```

---

## 6. 检查清单 (Checklist)

- [ ] **严格模式**: `tsconfig.json` 是否已开启 `strict`？
- [ ] **路径别名**: 是否使用了 `@/` 而非 `../../`？
- [ ] **命名**: 接口是否以大写字母开头？（不推荐加 `I` 前缀，如 `IUser`）
- [ ] **冗余**: 是否移除了不必要的显式类型标注（如 `const count: number = 0`）？
- [ ] **文档**: 复杂的泛型工具或公共接口是否添加了 TSDoc 注释？

---

## 最佳实践建议

1. **利用工具类型**: 熟练使用 `Pick`, `Omit`, `Partial`, `Record` 等内置工具，避免重复定义相似结构。
2. **模板字符串类型**: 对于具有固定格式的字符串（如：颜色代码、API 路径），使用模板字符串类型进行约束。
3. **防御性编程**: 对外部输入的数据（如本地存储、API 返回），使用 Zod 进行 Schema 校验。
