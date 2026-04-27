# `handle.ts` 文件规范

本文档定义 `handle.ts` 文件的职责、命名和使用规范。

---

## 📍 存放位置

| 位置 | 场景 |
|------|------|
| `apps/web/src/pages/[Page]/handle.ts` | 页面级可复用业务逻辑 |
| `apps/web/src/pages/[Page]/routes/[Route]/handle.ts` | 嵌套路由子页面的业务逻辑 |
| `apps/web/src/components/[Component]/handle.ts` | 全局公共组件的可复用纯逻辑抽取（可选） |

---

## 🎯 职责定位：单一职责，视图与逻辑分离

核心原则：**`handle.ts` 只存放纯函数，不包含副作用和 React Hook 依赖**

| 文件 | 职责 | 是否允许副作用 | 是否允许 React Hook |
|------|------|----------------|--------------------|
| `index.tsx` | 仅负责 UI 渲染、组件组合、JSX 结构 | ❌ 不允许（仅事件绑定） | ✅ 允许 |
| `useStore.ts` | 存放页面级 MobX 响应式状态 + 修改状态的动作（**包含 API 调用**） | ✅ 允许 | ✅ 允许（useLocalObservable） |
| `handle.ts` | **纯事件处理器、数据转换、无副作用业务逻辑** | ❌ **禁止**（例外：Dialog.confirm 等简单交互） | ❌ **禁止**（不能调用 Hook） |
| `constant.ts` | 存放页面常量（静态数据、配置项） | ❌ 不允许 | ❌ 不适用 |
| `hooks/useXxx.ts` | **需要依赖 React Hook 的业务逻辑**（包含 API 调用 + 路由跳转） | ✅ 允许 | ✅ 允许 |

### 关键约束

`handle.ts` **三条铁律**：
1. **禁止定义自定义 Hook**：不能出现 `useXxx` 这种以 `use` 开头的函数
2. **禁止在内部调用 React Hook**：React Hook 只能在组件或其他 Hook 中调用
3. **禁止存放 API 调用**：API 调用属于副作用，需要修改状态时放在 `useStore.ts`，不需要修改状态时放在 `hooks/`

---

## ✅ 纯函数纯度检测清单

编写 `handle.ts` 中的函数时，必须满足以下全部条件：

| 检测项 | 要求 | 说明 |
|--------|------|------|
| **确定性** | 相同输入永远产生相同输出 | 不能依赖外部可变状态（如全局变量、随机数、当前时间等），**例外**：Date.now()、Math.random() 等原生方法可使用但需在注释中注明 |
| **不可变性** | 不修改外部传入的参数对象 | 传入的数组、对象等参数不能被直接修改，需要时应创建副本 |
| **无副作用** | 不触发网络请求或异步操作 | 禁止 `fetch`、`axios`、`Promise` 等异步操作 |
| **Hook 隔离** | 不调用任何 React Hook | 包括 `useState`、`useEffect`、`useNavigate`、`useLocation` 等 |
| **无状态修改** | 不修改 MobX 状态 | 状态修改必须放在 `useStore.ts` |

---

## ❌ 副作用对照表

以下操作都属于副作用，**禁止**出现在 `handle.ts` 中：

| 操作类型 | 反例 | 正确存放位置 |
|---------|------|-------------|
| **网络请求** | `api.user.getUserInfo()`<br>`fetch(url)` | `useStore.ts` 或 `hooks/` |
| **DOM 操作** | `document.getElementById()`<br>`window.scrollTo()` | 组件内或 `hooks/` |
| **React Hook** | `useNavigate()`<br>`useLocation()` | 组件内或 `hooks/` |
| **状态修改** | `store.loading = true` | `useStore.ts` |
| **定时器** | `setTimeout()`<br>`setInterval()` | 组件内或 `hooks/` |
| **事件订阅** | `window.addEventListener()` | 组件内或 `hooks/` |

### ✅ 例外白名单（允许在 handle.ts 中使用）

| 操作 | 说明 |
|------|------|
| `Dialog.confirm()` | antd-mobile 的确认弹窗，返回 Promise<boolean> |
| `Toast.show()` | 轻量提示（建议尽量放在调用方处理） |
| `navigator.clipboard.writeText()` | 剪贴板操作 |
| `console.log/error/warn` | 日志输出 |
| `Date.now()` / `new Date()` | 时间获取 |
| `Math.random()` | 随机数生成 |

---

## ❌ 反例展示

### 反例 1：包含 API 调用

```typescript
// ❌ 错误：handle.ts 中调用 API
export const deleteArticle = async (id: string): Promise<void> => {
  await api.article.delete(id); // 副作用：网络请求
};

// ✅ 正确：放在 useStore.ts 中
async deleteArticle(id: string) {
  this.loading = true;
  await api.article.delete(id);
  this.loading = false;
}
```

### 反例 2：修改传入参数

```typescript
// ❌ 错误：直接修改传入的参数对象
export const formatArticle = (article: Article): void => {
  article.publishTime = new Date(article.publishTime).toLocaleDateString();
};

// ✅ 正确：创建副本返回，不修改原对象
export const formatArticle = (article: Article): Article => {
  return {
    ...article,
    publishTime: new Date(article.publishTime).toLocaleDateString(),
  };
};
```

### 反例 3：使用 React Hook

```typescript
// ❌ 错误：handle.ts 中使用 Hook
import { useNavigate } from 'react-router-dom';

export const goToDetail = (id: string): void => {
  const navigate = useNavigate(); // React 规则违反
  navigate(`/article/${id}`);
};

// ✅ 正确：放在 hooks/useGoToDetail.ts 中
export const useGoToDetail = () => {
  const navigate = useNavigate();
  return (id: string) => navigate(`/article/${id}`);
};
```

### 反例 4：定义自定义 Hook

```typescript
// ❌ 错误：handle.ts 中定义 Hook
export const useArticleFilter = (list: Article[]) => {
  return list.filter(item => item.published);
};

// ✅ 正确：纯函数，不需要 use 前缀
export const filterPublishedArticles = (list: Article[]): Article[] => {
  return list.filter(item => item.published);
};
```

---

## ✅ 命名规范

### 函数命名

| 函数类型 | 命名方式 | 示例 | 说明 |
|---------|----------|------|------|
| 事件处理函数 | `handleXxx` | `handleForgotPassword`, `handleRetry`, `handleMenuItemClick` | 用户交互事件处理 |
| 工具类函数 | 动词开头 | `formatPublishTime`, `truncateSummary`, `calculateReadingTime` | 数据格式化、业务计算 |
| 数据过滤函数 | `filterXxxByYyy` | `filterArticlesByCategory`, `filterDraftArticles` | 列表数据过滤 |
| 数据排序函数 | `sortXxxByYyy` | `sortArticlesByCreatedAt`, `sortArticlesByViews` | 列表数据排序 |
| 对话框确认 | `confirmXxx` | `confirmDeleteArticle`, `confirmSignOut` | 弹出确认对话框，返回 Promise<boolean> |

### 导出方式
- **必须**使用**具名导出**，每个函数独立导出
- **禁止**使用 `export default`

```ts
// ✅ 正确
export const handleMenuItemClick = (item: MenuItem): void => { ... };
export const formatPublishTime = (date: string): string => { ... };
export const confirmDeleteArticle = async (): Promise<boolean> => { ... };

// ❌ 错误
export default { handleMenuItemClick, formatPublishTime };
```

---

## ✅ TypeScript 要求

- **必须**为所有函数的参数和返回值添加显式类型声明
- 需要共享的类型可以在 `handle.ts` 中定义并 `export type` 导出

```ts
// ✅ 正确示例
import type { ArticleItem } from '../types';

export interface TimeFormatOptions {
  withPrefix?: boolean;
}

export const formatPublishTime = (
  publishAt: string,
  options: TimeFormatOptions = {},
): string => {
  const { withPrefix = true } = options;
  // 纯函数：输入 → 输出，不修改外部状态
  const date = new Date(publishAt);
  // ... 格式化逻辑
  return formattedTime;
};
```

---

## ✅ 适用场景（哪些逻辑适合放 `handle.ts`）

以下内容适合放在 `handle.ts`：

✅ **纯数据处理函数**
- 数据格式化（日期、价格、文本截断等）
- 列表过滤、排序
- 业务计算（阅读时间、折扣百分比等）
- 数据结构转换（扁平 → 树形，DTO → VO 等）

✅ **简单事件处理器**（不依赖 Hook）
- 日志埋点上报
- 复制文本到剪贴板
- 下载文件
- 打开新窗口跳转

✅ **简单交互确认**
- 弹出 Dialog 确认框，返回 `Promise<boolean>` 让调用方决定后续动作

---

## ❌ 不适用场景（哪些逻辑不能放 `handle.ts`）

以下内容**绝对不适合**放在 `handle.ts`：

❌ 自定义 Hook（以 `use` 开头的函数）→ 请放在 `hooks/useXxx.ts`
❌ 需要依赖 React Hook（`useNavigate`, `useLocation` 等）→ 请放在 `hooks/useXxx.ts` 或组件内
❌ API 调用和网络请求 → 请放在 `useStore.ts`（需要改状态）或 `hooks/useXxx.ts`（不需要改状态）
❌ MobX 响应式状态定义和修改 → 请放在 `useStore.ts`
❌ JSX/UI 渲染代码 → 请放在 `index.tsx` 或组件内
❌ 常量配置 → 请放在 `constant.ts`
❌ 跨页面复用的通用工具 → 请放在 `apps/web/src/utils/` 或 `apps/web/src/hooks/`

---

## ✅ 使用示例

### 示例一：文章列表页面 `handle.ts`

```ts
// apps/web/src/pages/ArticleList/handle.ts
import { Dialog } from 'antd-mobile';
import type { ArticleItem } from './types';

/**
 * 格式化文章发布时间
 */
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

  // 纯函数：根据时间差返回相对时间
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

/**
 * 计算文章阅读时间
 */
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 300;
  const wordCount = content.trim().length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

/**
 * 按分类过滤文章列表
 */
export const filterArticlesByCategory = (
  articles: ArticleItem[],
  categoryId: string,
): ArticleItem[] => {
  if (categoryId === 'all') return articles;
  return articles.filter(item => item.categoryId === categoryId);
};

/**
 * 确认删除文章对话框
 */
export const confirmDeleteArticle = async (
  articleTitle: string,
): Promise<boolean> => {
  return await Dialog.confirm({
    title: '确认删除',
    content: `确定要删除文章「${articleTitle}」吗？删除后无法恢复。`,
    confirmText: '删除',
    cancelText: '取消',
  });
};

/**
 * 复制文章链接到剪贴板
 */
export const copyArticleLink = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};
```

### 组件中如何使用

```tsx
// apps/web/src/pages/ArticleList/index.tsx
import React from 'react';
import { useObserver } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import * as handle from './handle';
import { useArticleListStore } from './useStore';
import { ArticleList, FilterBar } from './components';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const store = useArticleListStore();

  // 在组件中组合 Hook 和 handle 中的纯逻辑
  const handleDeleteArticle = async (article: ArticleItem): Promise<void> => {
    const confirmed = await handle.confirmDeleteArticle(article.title);
    if (confirmed) {
      // API 调用和状态修改放在 store 中
      await store.deleteArticle(article.id);
    }
  };

  const handleCopyLink = async (article: ArticleItem): Promise<void> => {
    const success = await handle.copyArticleLink(article.shareUrl);
    if (success) {
      Toast.show({ content: '复制成功' });
    } else {
      Toast.show({ content: '复制失败' });
    }
  };

  // 使用纯函数处理数据
  const filteredList = handle.filterArticlesByCategory(
    store.articleList,
    store.currentCategory,
  );

  return useObserver(() => (
    <div className={styles.articleListRoot}>
      <FilterBar
        categories={store.categories}
        currentCategory={store.currentCategory}
        onCategoryChange={store.setCurrentCategory}
      />
      <ArticleList
        data={filteredList}
        formatPublishTime={handle.formatPublishTime}
        onDelete={handleDeleteArticle}
        onCopyLink={handleCopyLink}
      />
    </div>
  ));
};

ArticleListPage.displayName = 'ArticleListPage';

export default ArticleListPage;
```

### 示例二：需要 React Hook 时的正确做法

当逻辑需要依赖 React Hook（如 `useNavigate`）但又想抽离出来时，请放在 `hooks/` 目录：

```
apps/web/src/pages/Profile/
├── index.tsx
├── useStore.ts
├── handle.ts         # 纯函数
├── hooks/
│   └── useSignOut.ts # 依赖 Hook 的业务逻辑
└── constant.ts
```

```ts
// apps/web/src/pages/Profile/hooks/useSignOut.ts
import { useNavigate } from 'react-router-dom';
import { confirmSignOut } from '../handle';
import { api } from '@/api';

export const useSignOut = () => {
  const navigate = useNavigate();

  const signOut = async (): Promise<void> => {
    // handle 中只做确认对话框
    const confirmed = await confirmSignOut();
    if (confirmed) {
      // API 调用和跳转放在 Hook 中
      await api.user.signOut();
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return signOut;
};
```

```tsx
// apps/web/src/pages/Profile/index.tsx
import { useSignOut } from './hooks/useSignOut';

const ProfilePage = () => {
  const signOut = useSignOut();

  return (
    <Button onClick={signOut}>退出登录</Button>
  );
};
```

---

## 📋 检查清单

编写或修改 `handle.ts` 后请检查：

### 纯函数检测

- [ ] ✅ 相同输入是否永远产生相同输出？
- [ ] ✅ 是否没有修改外部传入的参数对象？
- [ ] ✅ 是否没有网络请求和异步操作？
- [ ] ✅ 是否没有调用任何 React Hook？
- [ ] ✅ 是否没有定义以 `use` 开头的自定义 Hook？

### 代码规范

- [ ] ✅ 是否所有函数都使用具名导出？
- [ ] ✅ 是否所有参数和返回值都有显式类型声明？
- [ ] ✅ 函数命名是否符合规范？
- [ ] ✅ 函数职责是否单一？

### 分工校验

- [ ] ✅ 是否没有修改 MobX 状态？
- [ ] ✅ 是否没有 DOM 操作和事件订阅？
- [ ] ✅ 是否没有定时器和副作用？
- [ ] ✅ 复杂业务 Hook 是否已抽取到 `hooks/` 目录？

---

## 🎯 设计思想

为什么要这样拆分？

1. **纯函数易于测试**：纯函数不依赖外部状态，输入固定输出固定，方便单元测试
2. **Hook 逻辑放在 Hook**：React 规则就是 Hook 只能在组件或其他 Hook 中调用，不要违反
3. **职责清晰**：谁需要副作用谁来承载，`handle.ts` 只做它该做的事
4. **易于复用**：纯函数可以被多个组件/hook 调用，不耦合
