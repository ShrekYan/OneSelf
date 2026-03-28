# 自定义 Hooks 与错误处理规范

## 自定义 Hooks 规范

### 目录结构

按 Hook 的类型（通用技术 Hook vs 业务 Hook）分目录存放：

| Hook 类型 | 存放位置 | 说明 |
|-----------|----------|------|
| **通用技术 Hook** | `src/hooks/useXxx.ts` | 与业务无关，解决通用技术问题，可跨页面/项目复用 |
| **页面专用业务 Hook** | `src/pages/[Page]/hooks/useXxx.ts` | 当前页面专用的业务逻辑 Hook，仅在该页面使用 |
| **跨页面业务 Hook** | `src/hooks/useXxx.ts` 或 `src/api/[module]/hooks/useXxx.ts` | 多个页面复用的业务逻辑 Hook |

通用规则：
- **一个 Hook 一个文件**，按功能拆分
- 文件名：`useXxx.ts`（小驼峰命名，必须以 `use` 开头）
- 函数名必须以 `use` 开头，遵循 React Hooks 规则
- 渐进式设计：默认先放在页面内，真正需要跨页面复用再提升到全局

### TypeScript 要求
- 必须为所有参数和返回值定义完整的类型
- 通用 Hook 要支持泛型
- 复杂的返回类型可以单独定义接口

```typescript
// ✅ 正确示例
export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (str: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 实现...
}
```

### 设计原则
1. **单一职责**：一个 Hook 只做一件事
2. **可复用性**：抽离通用逻辑，消除重复代码
3. **依赖清晰**：所有依赖通过参数传入，不要隐藏依赖
4. **清理副作用**：在 `useEffect` 返回清理函数，及时清除定时器、事件监听器等
5. **避免过度抽象**：仅在确实需要复用时才抽离 Hook

---

## 错误边界规范

### 使用方式
- 使用 `react-error-boundary` 库实现错误边界
- 项目根组件必须包裹全局错误边界，提供兜底展示
- 高风险模块（如：动态加载、第三方组件）可以额外嵌套错误边界隔离

### 错误边界无法捕获
- 事件处理器中的错误（如：`onClick`）
- 异步代码（如：`setTimeout`、`Promise`）
- 错误边界自身抛出的错误
- 服务端渲染过程中的错误

### 使用示例

```tsx
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/ErrorFallback';

// 全局兜底
ReactDOM.createRoot(root).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
);
```

---

## 异常处理规范

### 分层策略

| 层级 | 职责 | 处理方式 |
|------|------|----------|
| **API 拦截器层** | 全局统一处理 | 自动显示 Toast 错误提示，401 自动退出登录 |
| **组件局部层** | 业务逻辑错误处理 | try/catch 捕获，处理页面状态 |
| **错误边界层** | 全局兜底 | 展示降级 UI，记录错误日志 |

### API 错误处理
- 默认开启全局 Toast 提示
- 如果需要组件自定义错误处理，需要添加 `skipErrorToast: true` 配置

```typescript
try {
  await api.auth.login(data, { skipErrorToast: true });
} catch (error) {
  // 自行处理错误，展示在表单上
}
```

### 异步错误处理
- 所有 `async` 异步操作必须用 `try/catch` 包裹
- `catch` 块中 `error` 类型是 `unknown`，必须进行类型收窄

```typescript
// ✅ 正确
try {
  await fetchData();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else if (typeof error === 'string') {
    console.error(error);
  }
}

// ❌ 错误 - 直接使用 error.message
catch (error) {
  console.error(error.message); // error 是 unknown，编译错误
}
```

### 最佳实践
- 早抛早捕：错误在哪个层级发生就在哪个层级处理
- 不吞错误：catch 后不要静默忽略，至少要打日志
- 降级展示：发生错误时给用户友好提示，不要白屏
