# hooks 目录规范

本文档定义页面级 `hooks/` 目录的拆分时机、职责边界、命名规范和分工原则。

---

## 📍 存放位置

| 位置 | 场景 |
|------|------|
| `apps/web/src/pages/[Page]/hooks/useXxx.ts` | 页面专用业务 Hook |
| `apps/web/src/hooks/useXxx.ts` | 跨页面复用的通用技术 Hook |

---

## 🎯 拆分阈值（满足任一条件即建议拆分）

当页面中的业务逻辑满足以下任一条件时，**必须**抽取到独立的 Hook 文件：

| 阈值 | 说明 |
|------|------|
| **代码行数** | 逻辑代码超过 50 行 |
| **Hook 依赖数量** | 同时依赖 3 个以上的 React Hook（如 `useNavigate`、`useLocation`、`useMemo` 等） |
| **复用性** | 需要被页面内多个组件复用 |
| **业务完整性** | 包含完整的业务流程（如：退出登录 = 确认弹窗 → API 调用 → 清除缓存 → 页面跳转） |

### 拆分决策流程图

```
判断是否需要抽取到 hooks/
    ↓
是否满足任一阈值？ → 否 → 保留在组件内或 useStore.ts
    ↓ 是
是否需要修改 MobX 状态？ → 是 → 放在 useStore.ts
    ↓ 否
是否为纯函数逻辑？ → 是 → 放在 handle.ts
    ↓ 否
放在 hooks/useXxx.ts
```

---

## ✅ Hook 职责边界

### 允许的操作

- ✅ 依赖并调用 React Hook（`useNavigate`、`useLocation`、`useParams` 等）
- ✅ 发起 API 调用（网络请求）
- ✅ 操作浏览器缓存（`localStorage`、`sessionStorage`）
- ✅ 页面路由跳转
- ✅ 调用 `handle.ts` 中的纯函数（如弹窗确认）

### 禁止的操作

- ❌ 直接修改 MobX 状态 → 必须通过 `useStore.ts` 中的方法修改
- ❌ 定义纯工具函数 → 请放在 `handle.ts` 中
- ❌ JSX 渲染逻辑 → 请放在组件内
- ❌ 跨页面通用逻辑 → 请放在 `apps/web/src/hooks/`

---

## ✅ 命名规范

### 文件名规范

```
hooks/
├── useSignOut.ts          ✅ 正确：use + 业务动作（驼峰）
├── useArticlePublish.ts   ✅ 正确：use + 领域 + 动作
├── signOut.ts             ❌ 错误：缺少 use 前缀
└── UseSignOut.ts          ❌ 错误：首字母不应大写
```

### 导出命名规范

```typescript
// ✅ 正确：具名导出
export const useSignOut = (): (() => Promise<void>) => {
  // ...
};

// ❌ 错误：默认导出
export default useSignOut;
```

---

## ✅ 与 store/handle 的分工对照表

| 场景 | 存放位置 | 理由 |
|------|---------|------|
| 需要修改 MobX 响应式状态的业务逻辑 | `useStore.ts` | 状态修改必须统一收口到 Store |
| 纯数据处理、格式化、计算（无副作用） | `handle.ts` | 纯函数易于测试和复用 |
| 依赖 React Hook 但不需要修改状态的完整业务流程 | `hooks/useXxx.ts` | Hook 只能在 Hook 或组件中调用 |
| 简单的事件回调，仅调用 1-2 个外部方法 | 组件内 inline | 过度抽离反而增加复杂度 |

---

## ✅ 代码模板

### 标准 Hook 写法示例

```typescript
// apps/web/src/pages/Profile/hooks/useSignOut.ts
import { useNavigate } from 'react-router-dom';
import { confirmSignOut } from '../handle';
import { authApi } from '@/api';

/**
 * 退出登录业务 Hook
 * @description 处理退出登录完整流程：弹窗确认 → 调用登出 API → 清除本地缓存 → 跳转登录页
 */
export const useSignOut = (): (() => Promise<void>) => {
  const navigate = useNavigate();

  const signOut = async (): Promise<void> => {
    // 1. 调用纯函数确认弹窗
    const confirmed = await confirmSignOut();
    if (!confirmed) return;

    try {
      // 2. API 调用
      await authApi.signOut();

      // 3. 清除本地缓存
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');

      // 4. 路由跳转
      navigate('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return signOut;
};
```

### 组件中使用

```tsx
// apps/web/src/pages/Profile/index.tsx
import React from 'react';
import { useObserver } from 'mobx-react';
import { Button } from 'antd-mobile';
import { useSignOut } from './hooks/useSignOut';

const ProfilePage: React.FC = () => {
  const signOut = useSignOut();

  return useObserver(() => (
    <div>
      {/* ... 其他内容 ... */}
      <Button onClick={signOut}>退出登录</Button>
    </div>
  ));
};

export default ProfilePage;
```

---

## 📋 检查清单

创建或修改 Hook 后请检查：

- [ ] 文件名是否符合 `useXxx.ts` 规范？
- [ ] 是否满足拆分阈值条件（代码行数、Hook 依赖数、复用性、业务完整性）？
- [ ] 是否没有直接修改 MobX 状态？
- [ ] 是否没有定义纯工具函数？
- [ ] 是否使用具名导出而不是默认导出？
- [ ] Hook 职责是否单一？（一个 Hook 只做一件事）
- [ ] 是否添加了清晰的 JSDoc 注释说明 Hook 的用途和完整流程？

---

## 🎯 设计思想

为什么需要这样拆分？

1. **符合 React 规则**：React Hook 只能在 Hook 或组件中调用，违反会导致运行时错误
2. **职责清晰**：纯逻辑放 `handle.ts`，状态修改放 `useStore.ts`，Hook 业务放 `hooks/`，各司其职
3. **易于测试**：纯函数可以独立单元测试，Hook 可以用 React Testing Library 测试
4. **易于复用**：相同逻辑可以被多个组件调用，不需要重复编写
5. **降低组件复杂度**：组件只负责渲染和事件绑定，复杂业务逻辑抽离到 Hook 中
