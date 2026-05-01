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

当页面中的业务逻辑满足以下任一条件时，**应该**抽取到独立的 Hook 文件：

| 阈值 | 说明 |
|------|------|
| **代码行数** | 逻辑代码超过 30 行 |
| **Hook 依赖数量** | 同时使用 2 个以上 React Hook（如 `useNavigate`、`useLocation`、`useMemo` 等） |
| **复用性** | 需要被页面内多个组件复用 |
| **业务完整性** | 包含 3 个以上步骤的完整业务流程（如：校验 → API 调用 → 成功处理 → 失败处理） |
| **异步逻辑** | 包含 `async/await` 的复杂异步流程 |

### 拆分决策流程图

```
判断业务逻辑放哪里
    ↓
是否需要管理响应式状态？ → 是 → 放在 useStore.ts
    ↓ 否
逻辑是否复杂？ → 是 → 放在 hooks/useXxx.ts
    ↓ 否
直接写在组件内（不需要额外文件）
```

---

## ✅ Hook 职责边界

### 允许的操作

- ✅ 依赖并调用 React Hook（`useNavigate`、`useLocation`、`useParams` 等）
- ✅ 发起 API 调用（网络请求）
- ✅ 操作浏览器缓存（`localStorage`、`sessionStorage`）
- ✅ 页面路由跳转
- ✅ 纯数据处理、格式化、计算（不需要额外的 handle.ts）
- ✅ 弹窗确认、Toast 提示等交互逻辑

### 禁止的操作

- ❌ 直接修改 MobX 状态 → 必须通过 `useStore.ts` 中的方法修改
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

## ✅ 与 store / 组件的分工对照表

| 场景 | 存放位置 | 理由 |
|------|---------|------|
| 需要管理 MobX 响应式状态 | `useStore.ts` | 状态修改必须统一收口到 Store |
| 逻辑复杂 / 依赖多个 Hook / 完整业务流程 | `hooks/useXxx.ts` | Hooks 封装复用性好，符合 React 规范 |
| 简单事件回调、内联处理逻辑 | 组件内 inline | 过度抽离反而跳转频繁，降低可读性 |
| 纯工具函数（跨页面复用） | `apps/web/src/utils/` | 真正需要复用的才全局化 |

---

## ✅ 代码模板

### 标准 Hook 写法示例

```typescript
// apps/web/src/pages/Profile/hooks/useSignOut.ts
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'antd-mobile';
import { authApi } from '@/api';

/**
 * 退出登录业务 Hook
 * @description 处理退出登录完整流程：弹窗确认 → 调用登出 API → 清除本地缓存 → 跳转登录页
 */
export const useSignOut = (): (() => Promise<void>) => {
  const navigate = useNavigate();

  const signOut = async (): Promise<void> => {
    // 1. 弹窗确认（纯交互逻辑直接写在 Hook 中，不需要额外 handle.ts）
    const confirmed = await Dialog.confirm({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
    });
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

### 简单逻辑直接写在组件内（不需要抽离 Hook）

```tsx
// ✅ 正确：简单逻辑直接 inline，不需要额外文件
const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();

  // 简单跳转，不需要抽离到 hooks/
  const handleArticleClick = (articleId: string): void => {
    navigate(`/article/${articleId}`);
  };

  return useObserver(() => (
    <div>
      <ArticleList onClick={handleArticleClick} />
    </div>
  ));
};
```

---

## 📋 检查清单

创建或修改 Hook 后请检查：

- [ ] 文件名是否符合 `useXxx.ts` 规范？
- [ ] 是否满足拆分阈值条件（代码行数、Hook 依赖数、复用性、业务完整性、异步逻辑）？
- [ ] 是否没有直接修改 MobX 状态？
- [ ] 简单逻辑是否没有过度抽离？
- [ ] 是否使用具名导出而不是默认导出？
- [ ] Hook 职责是否单一？（一个 Hook 只做一件事）
- [ ] 是否添加了清晰的 JSDoc 注释说明 Hook 的用途和完整流程？

---

## 🎯 设计思想

为什么需要这样设计？

1. **符合 React 规则**：React Hook 只能在 Hook 或组件中调用，这是官方规范
2. **降低认知负担**：不需要再纠结"这是纯函数吗？该放 handle 还是 hooks？"
3. **职责清晰**：状态修改放 `useStore.ts`，复杂业务放 `hooks/`，简单逻辑写组件内，各司其职
4. **易于测试**：Hooks 可以用 React Testing Library 独立测试
5. **易于复用**：相同逻辑可以被多个组件调用，不需要重复编写
6. **降低组件复杂度**：组件只负责渲染和事件绑定，复杂业务逻辑抽离到 Hook 中
7. **代码更内聚**：相关逻辑放在一起，不需要跨多个文件查看
