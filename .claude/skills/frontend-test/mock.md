## 六、Mock 规范

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
