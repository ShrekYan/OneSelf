---
# 这行是 glob 模式，告诉工具只在 ./src 目录下匹配所有 .ts 与 .tsx 文件  
pattern: ./src/**/*.{ts,tsx}
---

# TypeScript 开发规范

## 版本与配置

- TypeScript 版本：**5.5.3**
- 开启严格模式：`strict: true`
- 严格类型检查：必须启用完整的类型检查
- 不使用 `any` 类型，除非万不得已

---

## 基础规则

### 1. 类型声明

**✅ 必须做：**
- 所有变量、函数参数、返回值都必须有明确的类型
- 为所有组件 props 定义接口
- 为所有 API 响应数据定义类型
- 使用 `type` 或 `interface` 定义类型，避免重复定义

**❌ 禁止：**
```typescript
// 禁止
const data = any;
function process(user) { ... }
const items = [];
```

**✅ 正确：**
```typescript
// 正确
interface User {
  id: string;
  name: string;
  age: number;
}

function process(user: User): void { ... }
const items: string[] = [];
```

### 2. 类型推断

- 简单变量允许类型推断，不需要显式声明
```typescript
// 可以接受
const name = "claude";
const count = 1;
const isActive = true;
```

- 复杂对象必须显式声明类型
```typescript
// 需要显式类型
const user: User = { id: "1", name: "claude", age: 25 };
```

### 3. any 类型使用规范

- **绝对禁止** 通篇使用 `any` 绕过类型检查
- **只允许** 在以下场景使用：
  - 第三方库没有类型定义
  - 快速原型开发（后续必须补全）
  - 递归类型等特殊场景
- 优先使用 `unknown` 代替 `any`

```typescript
// 更好的选择
function parseJson(data: unknown): Result {
  // 需要先做类型检查
  if (typeof data === 'object' && data !== null) {
    // ...
  }
}
```

---

## 接口 vs 类型别名

### 使用 `interface` 的场景：
- 定义对象形状
- 定义组件 props
- 定义 API 响应数据结构
- 支持继承扩展

```typescript
interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

interface ButtonProps extends BaseProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

### 使用 `type` 的场景：
- 定义联合类型
- 定义交叉类型
- 定义泛型工具类型
- 定义元组
- 定义函数类型

```typescript
type Status = "idle" | "loading" | "success" | "error";

type ButtonSize = "small" | "medium" | "large";

type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
};
```

---

## 泛型使用

### 必须为泛型添加约束：
```typescript
// ✅ 正确
function getValue<T extends object>(obj: T, key: keyof T) {
  return obj[key];
}

// ❌ 错误
function getValue<T>(obj: T, key: string) {
  return obj[key];
}
```

### 常用泛型模式：
```typescript
// API 响应
type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
};

// 组件 Props 带 children
type PropsWithChildren<P = unknown> = P & { children: React.ReactNode };

// 异步函数
async function fetchData<T>(): Promise<ApiResponse<T>> {
  const response = await api.get();
  return response.data;
}
```

---

## MobX 特定规范

### Store 类型定义：
```typescript
import { makeAutoObservable } from "mobx";

class AppStore {
  // 必须声明字段类型
  loading: boolean = false;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 方法参数和返回值必须有类型
  setUser(user: User | null): void {
    this.user = user;
  }
}

export default new AppStore();
```

---

## React 特定规范

### 组件 Props：
```typescript
// ✅ 正确
interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onClick: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onClick,
}) => {
  return (
    // ...
  );
};
```

### Hooks 使用：
```typescript
// useState
const [user, setUser] = useState<User | null>(null);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// useEffect
useEffect(() => {
  // 清理函数返回 void
  return () => {
    // cleanup
  };
}, []);

// 自定义 Hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 实现
}
```

### React Hook Form：
```typescript
interface LoginForm {
  phone: string;
  password: string;
}

const { register, handleSubmit } = useForm<LoginForm>();
```

---

## 导入路径别名

必须使用路径别名，禁止过长的相对路径：

```typescript
// ✅ 正确
import { AppStore } from "@/store/app";
import { ApiResponse } from "@/types/api";
import { login } from "@/api/auth";

// ❌ 错误
import { AppStore } from ../../../../store/app;
```

---

## 枚举使用

- 推荐使用 `const enum` 或联合类型
- 简单状态使用联合类型，多个地方复用使用枚举

```typescript
// 推荐：联合类型
type OrderStatus = "pending" | "paid" | "shipped" | "delivered";

// 需要枚举值时
enum OrderStatusEnum {
  Pending = 1,
  Paid = 2,
  Shipped = 3,
  Delivered = 4,
}
```

---

## 可空类型

- 使用 `Type | null` 明确表示可空
- 不使用 `undefined` 表示缺失值，除非函数可选参数

```typescript
// ✅ 正确
let user: User | null = null;

// 可选参数
function createUser(name: string, age?: number) { ... }
```

---

## 类型断言

- 尽量避免类型断言
- 必要时使用 `as` 语法，不使用尖括号语法

```typescript
// ✅ 正确
const user = data as User;

// ❌ 错误
const user = <User>data;

// 更好：使用类型守卫
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

if (isUser(data)) {
  // data 自动推断为 User 类型
}
```

---

## 工具类型使用

合理使用 TypeScript 内置工具类型：

```typescript
// 可选属性
type PartialUser = Partial<User>;

// 只读属性
type ReadonlyUser = Readonly<User>;

// 选取部分属性
type UserPreview = Pick<User, "id" | "name">;

// 排除部分属性
type UserWithoutId = Omit<User, "id">;
```

---

## 注释规范

- 复杂类型必须添加注释说明用途
- 公共 API 的类型必须有文档注释

```typescript
/**
 * 商品信息
 */
interface Product {
  /** 商品ID */
  id: string;
  /** 商品名称 */
  name: string;
  /** 商品价格（单位：分） */
  price: number;
  /** 商品图片URL */
  image: string;
  /** 商品库存 */
  stock: number;
}
```

---

## 错误处理

```typescript
try {
  // ...
} catch (error) {
  // error 类型必须是 unknown
  if (error instanceof Error) {
    // 处理错误
  }
}
```

---

## 检查清单

编写 TypeScript 代码后检查：

- [ ] 所有变量都有正确的类型吗？
- [ ] 所有函数参数和返回值都有类型吗？
- [ ] 组件 props 都定义了接口吗？
- [ ] 有没有滥用 `any` 类型？
- [ ] 可空值是否用 `Type | null` 声明了？
- [ ] 使用了正确的路径别名 `@/` 吗？
- [ ] 有没有遗漏的类型定义？
- [ ] 泛型是否添加了正确的约束？
