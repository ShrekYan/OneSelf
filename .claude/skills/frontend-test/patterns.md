## 五、各类测试编写规范

### 1. 纯函数测试（项目特有）

**适用范围**：`useStore.ts` 中的纯函数、`utils/` 目录下的工具函数、数据格式化、过滤、排序等逻辑。**必须**写单元测试，因为都是纯函数非常容易测试，覆盖率要求 100%。

**规则：**
- 测试所有输入分支
- 测试边界条件
- 测试异常输入

**示例：**

```typescript
// apps/web/src/pages/ArticleList/useStore.ts
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
// apps/web/src/pages/ArticleList/__tests__/useStore.test.ts
import { formatPublishTime } from '../useStore';

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
- 和纯函数测试一样要求 100% 覆盖率
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
// apps/web/src/pages/ArticleList/useStore.ts
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
// apps/web/src/pages/ArticleList/__tests__/useStore.test.ts
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
