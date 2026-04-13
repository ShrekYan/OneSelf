---
name: frontend-test
description: 前端单元测试生成规范，基于 Vitest + React Testing Library 编写符合项目规范的测试用例
---

# 单元测试生成规则

本文档定义了前端项目单元测试的编写规范和生成规则。

---

## 技术栈

- **测试框架**: Vitest + React Testing Library
- **用户交互**: `@testing-library/user-event`
- **被测对象**: React 组件、自定义 Hooks、工具函数、MobX Store、`handle.ts` 纯函数
- **API 模拟**: MSW (Mock Service Worker)

---

## 测试文件位置

### 命名规范

```
src/
├── components/
│   ├── CountDown/
│   │   ├── index.tsx           # 组件源码
│   │   ├── index.module.scss  # 样式
│   │   └── __tests__/
│   │       └── index.test.tsx  # 单元测试
│   └── ...
├── hooks/
│   ├── useCountDown.ts         # Hook 源码
│   └── __tests__/
│       └── useCountDown.test.ts
├── utils/
│   ├── format.ts               # 工具函数
│   └── __tests__/
│       └── format.test.ts
├── store/
│   ├── product.store.ts        # MobX Store
│   └── __tests__/
│       └── product.store.test.ts
└── pages/
    └── ArticleList/
        ├── index.tsx
        ├── useStore.ts         # 页面 Store (useLocalObservable)
        ├── handle.ts           # 页面纯函数
        └── __tests__/
            ├── handle.test.ts  # handle 测试
            └── useStore.test.ts # useStore 测试
```

**规则：**
- 测试文件放在 `__tests__` 目录下
- 测试文件名：`{name}.test.ts` 或 `{name}.test.tsx`（组件）
- 一个源文件对应一个测试文件

---

## 测试原则

### 测试金字塔

```
        ^
        |  E2E 测试 (少)
        |
        |  集成测试 (中)
        |
        |  单元测试 (多)  ← 这里
```

### 测试什么

✅ **应该测试：**
- `handle.ts` 纯函数 - 各种输入输出、分支处理
- 工具函数 - 纯函数的各种输入输出
- 自定义 Hooks - 状态变化和副作用
- MobX Store - 业务逻辑和状态变更
- 组件 - 用户交互和不同状态下的渲染
- API 接口 - 响应解析

❌ **不应该测试：**
- 第三方库（已经测试过了）
- Ant Design Mobile 组件库（不需要重复测试）
- 简单的 getter/setter
- 已经测试过的逻辑

### 测试隔离

- 每个测试用例独立运行
- 每个测试前清理状态
- 不共享状态 between 测试用例
- Mock 每次都要重置

---

## 各类测试编写规范

### 1. handle.ts 纯函数测试（项目特有）

项目使用 `handle.ts` 存放页面纯函数（数据格式化、过滤、排序等），**必须**写单元测试，因为都是纯函数非常容易测试，覆盖率要求 100%。

**规则：**
- 测试所有输入分支
- 测试边界条件
- 测试异常输入

**示例：**

```typescript
// src/pages/ArticleList/handle.ts
export const formatPublishTime = (
  publishAt: string,
  relative = true,
): string => {
  const date = new Date(publishAt);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (!relative) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
```

```typescript
// src/pages/ArticleList/__tests__/handle.test.ts
import { formatPublishTime } from '../handle';

describe('formatPublishTime', () => {
  it('should return relative time within one hour', () => {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(formatPublishTime(tenMinutesAgo)).toBe('10分钟前');
  });

  it('should return relative time within one day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatPublishTime(threeHoursAgo)).toBe('3小时前');
  });

  it('should return absolute date when relative is false', () => {
    const date = new Date(2024, 0, 15).toISOString(); // 2024-01-15
    expect(formatPublishTime(date, false)).toBe('2024年1月15日');
  });
});
```

---

### 2. 工具函数测试

**规则：**
- 和 handle.ts 纯函数一样要求 100% 覆盖率
- 测试所有分支和边界

**示例同上，格式一致。**

---

### 3. 自定义 Hook 测试

使用 `renderHook` + `act` 测试。

**规则：**
- 测试初始状态
- 测试状态变更
- 测试副作用
- 测试清理逻辑

**示例：**

```typescript
// hooks/useCountDown.ts
export function useCountDown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // ... 实现
  return { seconds, isRunning, start, stop, reset };
}
```

```typescript
// hooks/__tests__/useCountDown.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCountDown } from '../useCountDown';

describe('useCountDown', () => {
  it('should initialize with correct seconds', () => {
    const { result } = renderHook(() => useCountDown(10));
    expect(result.current.seconds).toBe(10);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start countdown when calling start', () => {
    const { result } = renderHook(() => useCountDown(3));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(2);

    vi.useRealTimers();
  });
});
```

---

### 4. 页面 useStore.ts 测试（项目特有）

项目页面使用 `useLocalObservable` + 对象字面量管理局部状态，需要测试业务逻辑。

**规则：**
- 使用 `renderHook` 测试
- 每个测试重新渲染，保证隔离
- 使用 `act` 包裹 action 调用
- 测试初始状态、每个 action 对状态的修改

**示例：**

```typescript
// src/pages/ArticleList/useStore.ts
import { useLocalObservable } from 'mobx-react';

export function useArticleListStore() {
  const store = useLocalObservable(() => ({
    // 状态
    loading: false,
    articleList: [] as ArticleItem[],
    currentCategory: 'all',

    // 动作
    setLoading: (state: boolean) => {
      this.loading = state;
    },
    setCurrentCategory: (category: string) => {
      this.currentCategory = category;
    },
    fetchArticles: async () => {
      this.loading = true;
      try {
        const res = await api.article.list();
        this.articleList = res.list;
      } finally {
        this.loading = false;
      }
    },
  }));

  return store;
}
```

```typescript
// src/pages/ArticleList/__tests__/useStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useArticleListStore } from '../useStore';

// Mock API
vi.mock('@/api', () => ({
  api: {
    article: {
      list: vi.fn(),
    },
  },
}));

import { api } from '@/api';

describe('useArticleListStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct initial state', () => {
    const { result } = renderHook(() => useArticleListStore());
    expect(result.current.loading).toBe(false);
    expect(result.current.articleList).toEqual([]);
    expect(result.current.currentCategory).toBe('all');
  });

  it('should change current category when setCurrentCategory called', () => {
    const { result } = renderHook(() => useArticleListStore());

    act(() => {
      result.current.setCurrentCategory('1');
    });

    expect(result.current.currentCategory).toBe('1');
  });

  it('should fetch articles and update state', async () => {
    const mockData = [{ id: '1', title: 'Test' }];
    (api.article.list as vi.Mock).mockResolvedValue({ list: mockData });

    const { result } = renderHook(() => useArticleListStore());

    await act(async () => {
      await result.current.fetchArticles();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.articleList).toEqual(mockData);
  });
});
```

---

### 5. MobX 全局 Store 测试

**规则：**
- 每个测试新建实例，保证隔离
- 测试初始状态
- 测试每个 action 对状态的修改
- 测试 computed 值

**示例：**

```typescript
// store/cart.store.ts
class CartStore {
  items: ProductItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  addItem(item: ProductItem): void {
    this.items.push(item);
  }
}

export default new CartStore();
```

```typescript
// store/__tests__/cart.store.test.ts
import CartStore from '../cart.store';

describe('CartStore', () => {
  // 每个测试新建实例，保证隔离
  let store: CartStore;

  beforeEach(() => {
    store = new CartStore();
  });

  it('should have empty initial state', () => {
    expect(store.items).toEqual([]);
    expect(store.totalPrice).toBe(0);
  });

  it('should add item correctly', () => {
    store.addItem(mockProduct);
    expect(store.items.length).toBe(1);
    expect(store.totalPrice).toBe(100);
  });
});
```

---

### 6. React 组件测试

使用 React Testing Library 测试。

**规则：**
- 测试渲染
- 测试用户交互（点击、输入等）
- 测试不同 props 下的不同渲染
- 测试回调函数是否正确调用
- **按照用户行为测试，不要测试实现细节**

**查询元素优先级（必须遵守）：**
1. `getByRole` - 可访问性查询（推荐）
2. `getByLabelText` - 表单元素
3. `getByPlaceholderText` - 输入框占位符
4. `getByText` - 文本内容
5. `getByDisplayValue` - 表单值
6. `getByAltText` - 图片
7. `data-testid` - 最后手段

**示例：**

```typescript
// components/CountDown/index.tsx
interface CountDownProps {
  initialSeconds: number;
  onComplete?: () => void;
}

const CountDown: React.FC<CountDownProps> = ({ initialSeconds, onComplete }) => {
  // ... 实现
};
```

```typescript
// components/CountDown/__tests__/index.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountDown from '../index';

describe('CountDown', () => {
  it('should render initial seconds', () => {
    render(<CountDown initialSeconds={10} />);
    expect(screen.getByText('10s')).toBeInTheDocument();
  });

  it('should call onComplete when countdown finishes', () => {
    const onComplete = vi.fn();
    vi.useFakeTimers();

    render(<CountDown initialSeconds={1} onComplete={onComplete} />);
    fireEvent.click(screen.getByRole('button', { name: /开始/ }));

    vi.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
```

---

## Mock 规范

### 1. Mock 函数

使用 `vi.fn()`：

```typescript
const onComplete = vi.fn();
expect(onComplete).toHaveBeenCalled();
```

### 2. Mock API 请求

```typescript
// 简单测试直接用 vi.mock
vi.mock('@/api', () => ({
  api: {
    product: {
      getList: vi.fn(),
    },
  },
}));

it('should fetch product list', async () => {
  (api.product.getList as vi.Mock).mockResolvedValue({
    list: [],
    total: 0,
  });
  // ...测试
});
```

### 3. 清除 mock 状态

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 4. CSS Modules 处理

Vitest 自动忽略，如需要 mock 类名：

```typescript
vi.mock('../index.module.scss', () => ({
  default: { container: 'container', button: 'button' },
}));
```

---

## 覆盖率要求

| 模块 | 最低覆盖率 |
|------|-----------|
| handle.ts 纯函数 | **100%** |
| 工具函数 | **100%** |
| 自定义 Hooks | **100%** |
| MobX Store | 90% |
| 公共组件 | 80% |
| 页面组件 | 50% |

---

## 最佳实践

### 命名规范

```typescript
describe('FunctionOrComponentName', () => {
  it('should do something when some condition', () => { /* ... */ });
  it('should do another thing when some condition', () => { /* ... */ });
});
```

格式：`should {expected behavior} [when {condition}]`

### AAA 模式（Arrange-Act-Assert）

```typescript
it('should calculate total price correctly', () => {
  // Arrange - 准备
  store.addItem(product1);
  store.addItem(product2);

  // Act - 执行
  const total = store.totalPrice;

  // Assert - 断言
  expect(total).toBe(300);
});
```

### 一个测试用例只测一件事

✅ 好：每个测试一个断言（或一组相关断言）
❌ 不好：一个测试测试多个不相关场景

### 测试用户行为，不测试实现

```typescript
// ✅ 好 - 测试用户可见结果
fireEvent.click(screen.getByRole('button', { name: /开始/ }));
expect(screen.getByRole('button', { name: /开始/ })).toBeDisabled();

// ❌ 不好 - 测试内部状态
expect(component.instance.state.isRunning).toBe(true);
```

---

## 常见错误避免

1. ❌ 不要测试实现细节，只测试外部行为
2. ❌ 不要在测试中使用 `act` 包裹不必要的代码
3. ❌ 不要忘记清理定时器、fakeTimers（`vi.useRealTimers()`）
4. ❌ 不要忘记在 `beforeEach` 重置 mock
5. ❌ 不要用 `expect.any(Object)` 模糊匹配，尽可能精确断言
6. ❌ 不要在测试中写复杂逻辑 - 如果测试本身复杂，可能拆分错了
7. ❌ 不要使用相对路径导入，始终使用 `@/` 别名

---

## 生成测试检查清单

生成测试后，请检查：

- [ ] 测试文件位置和命名是否正确？
- [ ] 是否覆盖了所有分支？
- [ ] 是否测试了边界条件和错误情况？
- [ ] Mock 是否正确重置？
- [ ] 断言是否精确？
- [ ] 是否遵循 AAA 模式？
- [ ] 命名是否符合 `should ... when ...` 格式？
- [ ] 是否清理了副作用（定时器、fakeTimers）？
- [ ] TypeScript 类型是否正确，无 `any`？
- [ ] 导入排序是否正确（第三方 → 别名 → 相对）？

---

## 运行测试命令

```bash
# 运行所有测试（监视模式）
npm run test

# 单次运行（CI）
npm run test:run

# 生成覆盖率报告
npm run test:coverage

# 运行指定文件
npx vitest run src/components/CountDown/__tests__/index.test.tsx

# UI 模式
npm run test:ui
```
