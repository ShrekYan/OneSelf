# 文档生成规则

本文档定义了组件和模块的文档生成规范，确保代码可读性和可维护性。

## 文档类型

| 文档类型 | 位置 | 说明 |
|----------|------|------|
| 组件文档 | `src/components/ComponentName/README.md` | 公共可复用组件 |
| 页面模块文档 | `src/pages/PageName/README.md` | 复杂业务页面模块 |
| API 文档 | 在 `@/api` 代码中通过 JSDoc 注释 | API 接口文档 |
| Hook 文档 | 在代码中通过 JSDoc 注释 | 自定义 Hook |

---

## 公共组件文档结构

每个公共可复用组件必须包含 `README.md`，位于组件目录下：

```
src/components/
└── CountDown/
    ├── index.tsx           # 组件源码
    ├── index.module.scss  # 样式
    ├── __tests__/          # 单元测试
    │   └── index.test.tsx
    └── README.md           # 组件文档 ← 这里
```

### README.md 标准模板

```markdown
# ComponentName 组件

一句话介绍组件的用途。

## 引入方式

```tsx
import ComponentName from '@/components/ComponentName';
```

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `initialSeconds` | `number` | ✅ | - | 初始倒计时秒数 |
| `onComplete` | `() => void` | ❌ | - | 倒计时完成回调 |
| `autoStart` | `boolean` | ❌ | `false` | 是否自动开始倒计时 |
| `className` | `string` | ❌ | - | 自定义 CSS 类名 |
| `style` | `CSSProperties` | ❌ | - | 自定义内联样式 |

## 使用示例

### 基本使用

```tsx
<CountDown initialSeconds={60} onComplete={() => console.log('倒计时完成')} />
```

### 自动开始

```tsx
<CountDown initialSeconds={60} autoStart />
```

## 注意事项

- 列出特殊使用场景需要注意的问题
- 说明移动端适配相关事项
- 列出依赖项或兼容性问题

## 相关组件

- [xxx](../xxx/README.md) - 相关关联组件链接
```

---

## 代码注释规范

### JSDoc 注释规范

#### 1. 类型/接口注释

每个导出的接口必须添加 JSDoc 注释：

```typescript
/**
 * 倒计时组件属性
 */
interface CountDownProps {
  /** 初始倒计时秒数 */
  initialSeconds: number;
  /** 倒计时完成回调 */
  onComplete?: () => void;
  /** 是否自动开始 */
  autoStart?: boolean;
}
```

#### 2. 自定义 Hook 注释

```typescript
/**
 * 倒计时 Hook - 管理倒计时状态
 * @param initialSeconds - 初始秒数
 * @returns 倒计时状态和控制方法
 * @example
 * ```ts
 * const { seconds, isRunning, start, stop, reset } = useCountDown(60);
 * ```
 */
export function useCountDown(initialSeconds: number) {
  // ...
  return { seconds, isRunning, start, stop, reset };
}
```

#### 3. 工具函数注释

```typescript
/**
 * 格式化价格为保留两位小数的字符串
 * @param price - 原始价格（单位：分）
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number): string {
  // ...
}
```

#### 4. MobX Store 注释

```typescript
/**
 * 购物车状态管理 Store
 */
class CartStore {
  /** 购物车商品列表 */
  items: ProductItem[] = [];

  /** 购物车总价 */
  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * 添加商品到购物车
   * @param item - 要添加的商品项
   */
  addItem(item: ProductItem): void {
    this.items.push(item);
  }

  /**
   * 清空购物车所有商品
   */
  clear(): void {
    this.items = [];
  }
}
```

### 代码内部注释

**需要添加注释的场景：**
- 复杂业务逻辑，说明**为什么**这么做
- 处理了边界特殊情况，说明处理了什么情况
- Hack 或 workaround，说明原因
- 复杂算法，说明思路

**不需要添加注释的场景：**
- 显而易见的简单代码
- 好的命名本身就是文档

**示例：**

```typescript
// ✅ 好注释
// iOS 橡皮筋滚动，需要阻止默认行为避免页面整体滚动
e.preventDefault();

// ❌ 没必要注释
// 循环遍历数组，i 从 0 开始
for (let i = 0; i < length; i++) {
```

---

## 页面模块文档

页面业务逻辑复杂时，可以添加 `README.md` 说明：

### 页面文档模板

```markdown
# PageName 页面

页面功能一句话描述。

## 业务流程

描述页面的业务流程：

1. 用户进入页面，加载 XXX 数据
2. 用户操作 YYY，触发 ZZZ 逻辑
3. ...

## 数据流向

- 从哪些 API 接口获取数据
- 使用哪个 Store 管理状态
- 会跳转到哪些页面

## 特殊业务规则

- 列出特殊的业务规则说明
- 特殊交互说明
- 依赖其他模块说明
```

---

## API 文档规范

API 文档通过 TypeScript 类型 + JSDoc 注释实现，不需要单独 README：

```typescript
// src/api/user/types.ts
/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户ID */
  id: string;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像URL */
  avatar: string;
  /** 用户手机号 */
  phone: string;
  /** 用户等级 1-5 */
  level: number;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 手机号 */
  phone: string;
  /** 验证码 */
  code: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  /** 认证token */
  token: string;
  /** 用户信息 */
  userInfo: UserInfo;
}
```

```typescript
// src/api/user/index.ts
import { api } from '@/api/index.tsx';
import type { LoginRequest, LoginResponse, UserInfo } from './types';

/**
 * 手机号验证码登录
 * @param params - 登录参数
 */
export async function login(params: LoginRequest): Promise<LoginResponse> {
  return await api.post('/auth/login', params, {
    skipAuth: true, // 不需要认证
  });
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return await api.get('/user/info');
}
```

---

## 文档编写原则

### 1. 受众明确

- **组件文档**：给其他开发者使用这个组件时阅读
- **页面文档**：给后续维护这个页面的开发者阅读
- **代码注释**：给自己和队友，理解为什么这么写

### 2. 内容选择

✅ **应该写：**
- **做什么** - 组件/函数的用途
- **怎么用** - 提供可运行的使用示例
- **参数说明** - 每个参数的含义、类型、默认值
- **特殊情况** - 需要注意的坑
- **为什么这么做** - 复杂决策的原因

❌ **不应该写：**
- 不要重复代码已经说清楚的内容
- 不要写过时的信息
- 不要写废话（代码已经能看懂就不用重复）

### 3. 示例要简洁可运行

示例代码应该是最简可运行版本，复制就能用：

```markdown
## 示例

```tsx
// ✅ 好示例 - 完整可运行
import CountDown from '@/components/CountDown';

function App() {
  return <CountDown initialSeconds={60} />;
}
```

---

## 保持文档同步

修改代码后必须同步更新文档：

- 修改组件 API 必须同步更新 Props 表格
- 新增参数必须添加说明
- 删除参数必须从表格移除
- 示例代码要保持最新

---

## 生成文档检查清单

生成文档后，请检查：

### 组件 README.md

- [ ] 是否有一句话功能描述？
- [ ] 是否有完整的 Props 参数表格？
- [ ] 每个参数是否都包含类型、必填、默认值、说明？
- [ ] 是否提供了使用示例？
- [ ] 示例代码是否正确可运行？
- [ ] 是否说明了需要注意的特殊情况？

### JSDoc 注释

- [ ] 所有导出类型/接口都有注释吗？
- [ ] 每个字段都有注释说明吗？
- [ ] 所有导出函数/Hook 都有注释吗？
- [ ] 参数和返回值都说明清楚了吗？
- [ ] 复杂场景是否提供了使用示例？

### 代码注释

- [ ] 复杂业务逻辑是否有说明？
- [ ] Hack/workaround 是否说明原因？
- [ ] 是否删除了过时的注释？
- [ ] 是否没有多余的废话注释？

---

## 完整示例

### 完整组件 README 示例

# CountDown 倒计时组件

用于展示倒计时，支持开始、停止、重置功能，常用于验证码发送倒计时、活动结束倒计时等场景。

## 引入方式

```tsx
import CountDown from '@/components/CountDown';
```

## Props 参数说明

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `initialSeconds` | `number` | ✅ | - | 初始倒计时秒数 |
| `onComplete` | `() => void` | ❌ | - | 倒计时完成时触发回调 |
| `autoStart` | `boolean` | ❌ | `false` | 是否初始化后自动开始倒计时 |
| `className` | `string` | ❌ | - | 自定义 CSS 类名 |
| `style` | `CSSProperties` | ❌ | - | 自定义内联样式 |

## 使用示例

### 验证码发送倒计时

```tsx
const [countdown, setCountdown] = useState(false);

const sendCode = () => {
  // 发送验证码逻辑
  setCountdown(true);
};

<CountDown
  initialSeconds={60}
  onComplete={() => setCountdown(false)}
  autoStart={countdown}
/>
```

### 活动结束倒计时

```tsx
<CountDown initialSeconds={3600} onComplete={handleComplete} autoStart />
```

## 注意事项

- 在 iOS 后台，`setInterval` 可能受页面休眠影响，本组件已做自动校正优化
- 如果需要展示毫秒级精度，请使用 `CountDownMs` 组件
- 倒计时最大支持 99 小时

## 相关组件

- [CountDownMs](../CountDownMs/README.md) - 毫秒级高精度倒计时组件

---

## JSX/React 组件注释规范

### 组件 JSDoc 注释规则

#### 1. 函数组件注释

每个导出的页面组件或公共组件必须添加 JSDoc 注释说明用途：

```tsx
/**
 * 首页 - 项目欢迎页面
 * @description 展示项目技术特性列表、开发命令，演示 MobX 异步加载状态管理和路由跳转
 */
const Home: React.FC = observer(() => {
  // ...
});

export default Home;
```

```tsx
/**
 * 登录页面
 * @description 用户通过手机号验证码登录，支持自动跳转回原页面
 */
const Login: React.FC = () => {
  // ...
};
```

#### 2. 带 Props 的组件注释

对于有 Props 的公共组件，先在 `interface` 上注释，再在组件上注释：

```tsx
/**
 * 商品卡片组件属性
 */
interface ProductCardProps {
  /** 商品ID */
  id: string;
  /** 商品名称 */
  name: string;
  /** 商品价格（单位：分） */
  price: number;
  /** 商品图片URL */
  image: string;
  /** 点击卡片回调 */
  onClick: (id: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 商品卡片 - 展示商品基本信息，支持点击跳转
 * @example
 * ```tsx
 * <ProductCard
 *   id="1"
 *   name="商品名称"
 *   price={1000}
 *   image="https://example.com/image.jpg"
 *   onClick={handleClick}
 * />
 * ```
 */
const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  onClick,
  disabled = false,
}) => {
  // ...
};
```

#### 3. 事件处理函数注释

组件内部复杂的事件处理函数需要添加注释：

```tsx
const [form] = useForm<LoginForm>();

/**
 * 提交表单 - 调用登录API，成功后跳转
 */
const handleSubmit = async (data: LoginForm) => {
  // ...
};

/**
 * 获取验证码 - 校验手机号，调用发送验证码API
 */
const handleSendCode = async () => {
  // ...
};
```

#### 4. 内联注释规则

**JSX 结构中的注释：**

```tsx
return (
  <div className={style.container}>
    {/* 头部区域 - 显示标题和图标 */}
    <div className={style.header}>
      <h1>{title}</h1>
    </div>

    {/* 商品列表 - 下拉加载更多 */}
    <div className={style.list}>
      {list.map(item => (
        <ProductCard key={item.id} {...item} />
      ))}
    </div>

    {/* 底部安全区域 - 适配 iPhone 小黑条 */}
    <div className={style.safeArea} />
  </div>
};
```

**JSX 注释规范：**
- 使用 `{/* 内容 */}` 格式，不使用 `// 内容` 或 `/* 内容 */`
- 注释块前后保留一个空格：`{/* 注释 */}` ✅，`{/*注释*/}` ❌
- 对分块的 JSX 结构添加说明注释，提高可读性

#### 5. 复杂条件渲染注释

条件判断逻辑复杂时，说明判断条件：

```tsx
{/* 未登录状态 - 显示登录按钮 */}
{!user && <LoginButton />}

{/* 已登录且有权限 - 显示操作按钮 */}
{user && hasPermission && <ActionButton />}

{/* 已登录但无权限 - 显示占位提示 */}
{user && !hasPermission && <NoPermissionTip />}
```

### JSX 注释检查清单

- [ ] 组件是否有 JSDoc 一句话功能说明？
- [ ] Props 接口每个字段是否都有注释？
- [ ] 复杂的事件处理函数是否添加了注释？
- [ ] JSX 分块结构是否使用 `{/* 注释 */}` 说明？
- [ ] 复杂条件渲染是否说明判断条件？
- [ ] 是否删除了注释掉的死代码？
- [ ] 有没有不必要的废话注释（代码已经说清楚的不用重复注释）？

### 总结

| 注释位置 | 注释方式 | 要求 |
|----------|----------|------|
| 组件函数 | JSDoc `/** ... */` | 必须，一句话说明组件用途 |
| Props 接口 | JSDoc `/** ... */` | 必须，每个字段都要说明 |
| 组件内部复杂函数 | JSDoc 或行注释 | 复杂函数必须，简单函数可省略 |
| JSX 分块结构 | JSX 注释 `{/* ... */}` | 推荐，提高可读性 |
| 复杂条件分支 | 行内/块注释 | 必须，说明判断条件 |
| 显而易见的代码 | 不需要注释 | - |
