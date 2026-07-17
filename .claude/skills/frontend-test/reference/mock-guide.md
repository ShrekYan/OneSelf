# Mock 规范

## Mock 函数

使用 `vi.fn()` 创建 mock 函数：

```typescript
const onComplete = vi.fn();
expect(onComplete).toHaveBeenCalled();
```

## Mock API 请求

简单测试直接使用 `vi.mock`：

```typescript
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

## 清除 mock 状态

每个测试前清除 mock 状态：

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## CSS Modules 处理

Vitest 自动忽略 CSS Modules。如需要 mock 类名：

```typescript
vi.mock('../index.module.scss', () => ({
  default: { container: 'container', button: 'button' },
}));
```
