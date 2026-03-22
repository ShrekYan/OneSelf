# 单元测试生成规则

本文档定义了前端项目单元测试的编写规范和生成规则。

## 技术栈

- **测试框架**: Jest + React Testing Library
- **被测对象**: React 组件、自定义 Hooks、工具函数、MobX Store
- **模拟**: Jest mocking，MSW 用于 API 模拟

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
└── store/
    ├── product.store.ts        # MobX Store
    └── __tests__/
        └── product.store.test.ts
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
        | 集成测试 (中)
        |
        | 单元测试 (多)  ← 这里
```

### 测试什么

✅ **应该测试：**
- 工具函数 - 纯函数的各种输入输出
- 自定义 Hooks - 状态变化和副作用
- MobX Store - 业务逻辑和状态变更
- 组件 - 用户交互和不同状态下的渲染
- API 接口类型 - 反序列化

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

### 1. 工具函数测试

**规则：**
- 测试所有输入分支
- 测试边界条件
- 测试异常输入

**示例：**

```typescript
// utils/format.ts
export function formatPrice(price: number): string {
  if (price < 0) return '0.00';
  return price.toFixed(2);
}

// __tests__/format.test.ts
import { formatPrice } from '../format';

describe('formatPrice', () => {
  it('should format positive integer correctly', () => {
    expect(formatPrice(100)).toBe('100.00');
  });

  it('should format decimal correctly', () => {
    expect(formatPrice(123.45)).toBe('123.45');
  });

  it('should return 0.00 for negative price', () => {
    expect(formatPrice(-10)).toBe('0.00');
  });

  it('should format zero correctly', () => {
    expect(formatPrice(0)).toBe('0.00');
  });
});
```

### 2. 自定义 Hook 测试

使用 `@testing-library/react-hooks` 测试。

**规则：**
- 测试初始状态
- 测试状态变更
- 测试副作用
- 测试清理逻辑

**示例：**

```typescript
// hooks/useCountDown.ts
import { useState, useEffect, useCallback } from 'react';

export function useCountDown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, seconds]);

  return { seconds, isRunning, start, stop, reset };
}
```

```typescript
// __tests__/useCountDown.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useCountDown } from '../useCountDown';

describe('useCountDown', () => {
  it('should initialize with correct seconds', () => {
    const { result } = renderHook(() => useCountDown(10));
    expect(result.current.seconds).toBe(10);
    expect(result.current.isRunning).toBe(false);
  });

  it('should start countdown when calling start', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCountDown(3));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.seconds).toBe(2);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(0);
    expect(result.current.isRunning).toBe(false);

    jest.useRealTimers();
  });

  it('should stop countdown when calling stop', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useCountDown(10));

    act(() => {
      result.current.start();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(result.current.seconds).toBe(8);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(result.current.seconds).toBe(8); // 不应该继续减少

    jest.useRealTimers();
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCountDown(10));

    act(() => {
      result.current.start();
      result.current.reset();
    });

    expect(result.current.seconds).toBe(10);
    expect(result.current.isRunning).toBe(false);
  });
});
```

### 3. MobX Store 测试

**规则：**
- 测试初始状态
- 测试每个 action 对状态的修改
- 测试 computed 值
- 不需要测试 React 渲染

**示例：**

```typescript
// store/cart.store.ts
import { makeAutoObservable } from 'mobx';
import type { ProductItem } from '@/types/product';

class CartStore {
  items: ProductItem[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  get itemCount(): number {
    return this.items.length;
  }

  addItem(item: ProductItem): void {
    this.items.push(item);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clear(): void {
    this.items = [];
  }
}

export default new CartStore();
```

```typescript
// __tests__/cart.store.test.ts
import CartStore from '../cart.store';
import type { ProductItem } from '@/types/product';

// Mock 产品数据
const mockProduct1: ProductItem = {
  id: '1',
  name: 'Product 1',
  price: 100,
  image: 'test.jpg',
};

const mockProduct2: ProductItem = {
  id: '2',
  name: 'Product 2',
  price: 200,
  image: 'test2.jpg',
};

describe('CartStore', () => {
  // 每个测试前清空购物车
  beforeEach(() => {
    CartStore.clear();
  });

  it('should have empty initial state', () => {
    expect(CartStore.items).toEqual([]);
    expect(CartStore.itemCount).toBe(0);
    expect(CartStore.totalPrice).toBe(0);
  });

  it('should add item correctly', () => {
    CartStore.addItem(mockProduct1);
    expect(CartStore.items.length).toBe(1);
    expect(CartStore.itemCount).toBe(1);
    expect(CartStore.totalPrice).toBe(100);
  });

  it('should calculate totalPrice correctly', () => {
    CartStore.addItem(mockProduct1);
    CartStore.addItem(mockProduct2);
    expect(CartStore.totalPrice).toBe(300);
  });

  it('should remove item correctly', () => {
    CartStore.addItem(mockProduct1);
    CartStore.addItem(mockProduct2);
    expect(CartStore.items.length).toBe(2);

    CartStore.removeItem('1');
    expect(CartStore.items.length).toBe(1);
    expect(CartStore.items[0].id).toBe('2');
  });

  it('should clear cart correctly', () => {
    CartStore.addItem(mockProduct1);
    CartStore.addItem(mockProduct2);
    expect(CartStore.items.length).toBe(2);

    CartStore.clear();
    expect(CartStore.items).toEqual([]);
    expect(CartStore.totalPrice).toBe(0);
  });
});
```

### 4. React 组件测试

使用 React Testing Library 测试。

**规则：**
- 测试渲染
- 测试用户交互（点击、输入等）
- 测试不同 props 下的不同渲染
- 测试回调函数是否正确调用
- 按照用户行为测试，不要测试实现细节

**示例：**

```typescript
// components/CountDown/index.tsx
import React from 'react';
import { useCountDown } from '@/hooks/useCountDown';
import styles from './index.module.scss';

interface CountDownProps {
  initialSeconds: number;
  onComplete?: () => void;
}

const CountDown: React.FC<CountDownProps> = ({ initialSeconds, onComplete }) => {
  const { seconds, isRunning, start, stop, reset } = useCountDown(initialSeconds);

  React.useEffect(() => {
    if (seconds === 0 && !isRunning && onComplete) {
      onComplete();
    }
  }, [seconds, isRunning, onComplete]);

  return (
    <div className={styles.container}>
      <span className={styles.time}>{seconds}s</span>
      <button onClick={start} disabled={isRunning}>开始</button>
      <button onClick={stop} disabled={!isRunning}>停止</button>
      <button onClick={reset}>重置</button>
    </div>
  );
};

export default CountDown;
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
    expect(screen.getByText('开始')).toBeEnabled();
    expect(screen.getByText('停止')).toBeDisabled();
  });

  it('should call onComplete when countdown finishes', () => {
    const onComplete = jest.fn();
    jest.useFakeTimers();

    render(<CountDown initialSeconds={1} onComplete={onComplete} />);

    fireEvent.click(screen.getByText('开始'));
    expect(onComplete).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(onComplete).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });

  it('should disable start button when running', () => {
    render(<CountDown initialSeconds={10} />);

    fireEvent.click(screen.getByText('开始'));
    expect(screen.getByText('开始')).toBeDisabled();
    expect(screen.getByText('停止')).toBeEnabled();
  });

  it('should reset when click reset button', () => {
    jest.useFakeTimers();
    render(<CountDown initialSeconds={10} />);

    fireEvent.click(screen.getByText('开始'));
    jest.advanceTimersByTime(3000);
    expect(screen.getByText('7s')).toBeInTheDocument();

    fireEvent.click(screen.getByText('重置'));
    expect(screen.getByText('10s')).toBeInTheDocument();
    expect(screen.getByText('开始')).toBeEnabled();

    jest.useRealTimers();
  });
});
```

---

## Mock 规范

### 1. Mock API 请求

使用 MSW (Mock Service Worker) 或者 Jest mock：

```typescript
// 对于简单测试使用 Jest mock
jest.mock('@/api/index.tsx', () => ({
  productApi: {
    getProductList: jest.fn(),
  },
}));

import api from '@/api';

it('should fetch product list', async () => {
  (api.product.getProductList as jest.Mock).mockResolvedValue({
    list: [],
    total: 0,
    page: 1,
    hasMore: false,
  });

  // ... 测试逻辑
});
```

### 2. Mock React Router

```typescript
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};
```

### 3. Mock 移动端环境

```typescript
// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

---

## 测试覆盖率要求

| 模块 | 最低覆盖率 |
|------|-----------|
| 工具函数 | 90% |
| 自定义 Hooks | 80% |
| MobX Store | 80% |
| 公共组件 | 70% |
| 页面组件 | 50% |

---

## 最佳实践

### 命名规范

```typescript
describe('ClassNameOrFunctionName', () => {
  it('should do something when some condition', () => { ... });
  it('should do another thing', () => { ... });
});
```

格式：`should {expected behavior} [when {condition}]`

### AAA 模式（Arrange-Act-Assert）

```typescript
it('should calculate total price correctly', () => {
  // Arrange - 准备
  cartStore.addItem(product1);
  cartStore.addItem(product2);

  // Act - 执行
  const total = cartStore.totalPrice;

  // Assert - 断言
  expect(total).toBe(300);
});
```

### 一个测试用例只测一件事

✅ 好：每个测试一个断言（或一组相关断言）
❌ 不好：一个测试测试多个不相关场景

### 测试用户行为，不测试实现

```typescript
// ✅ 好 - 测试用户行为
fireEvent.click(screen.getByText('开始'));
expect(screen.getByText('开始')).toBeDisabled();

// ❌ 不好 - 测试内部状态
expect(component.instance.state.isRunning).toBe(true);
```

---

## 常见错误避免

1. ❌ 不要测试实现细节，只测试外部行为
2. ❌ 不要在测试中使用 `act` 包裹不必要的代码
3. ❌ 不要忘记清理定时器、fakeTimers
4. ❌ 不要忘记在 beforeEach 重置 mock 和状态
5. ❌ 不要用 `expect.any(Object)` 模糊匹配，尽可能精确断言
6. ❌ 不要在测试中写复杂逻辑 - 如果测试本身复杂，可能拆分错了

---

## 生成测试检查清单

生成测试后，请检查：

- [ ] 测试文件位置和命名是否正确？
- [ ] 是否覆盖了所有分支？
- [ ] 是否测试了边界条件？
- [ ] 是否测试了错误情况？
- [ ] Mock 是否正确重置？
- [ ] 断言是否精确？
- [ ] 是否遵循 AAA 模式？
- [ ] 命名是否符合 `should ... when ...` 格式？
- [ ] 是否清理了副作用（定时器、fakeTimers）？
- [ ] 快照测试是否必要？（不要滥用快照）

---

## 运行测试命令

```bash
# 运行所有测试
npm test

# 运行指定文件
npm test src/components/CountDown/__tests__/index.test.tsx

# 监视模式
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage
```
