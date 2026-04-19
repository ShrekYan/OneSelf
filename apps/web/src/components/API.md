# 全局公共组件 API 文档

本文档定义了 `src/components/` 目录下所有**全局公共组件**的 API 接口。所有组件遵循项目纯组件原则：数据通过 Props 输入，事件通过回调输出，不依赖全局 Store 和 API。

## 目录

- [导入导出说明](#导入导出说明)
- [LazyImage - 懒加载图片组件](#lazyimage---懒加载图片组件)
- [Loading - 加载提示组件](#loading---加载提示组件)
- [ErrorFallback - 错误兜底组件](#errorfallback---错误兜底组件)
- [ArticleActionBar - 文章操作栏组件](#articleactionbar---文章操作栏组件)

---

## 导入导出说明

所有全局公共组件**必须统一从 `@/components` 导入**：

```tsx
// ✅ 正确用法（推荐）
import { LazyImage, Loading, ErrorFallback, ArticleActionBar } from '@/components';
import type { LazyImageProps, LoadingProps, ErrorFallbackProps, ArticleActionBarProps } from '@/components';

// ❌ 错误用法（不允许）
import LazyImage from '@/components/LazyImage';
```

所有组件的 Props 类型可以单独导入使用。

---

## LazyImage - 懒加载图片组件

### 组件介绍

使用 `IntersectionObserver` API 实现图片懒加载。当图片进入视口范围（加上提前加载边距）时才开始加载图片，提升页面加载性能，减少不必要的网络请求。

### 目录结构

```
src/components/LazyImage/
├── index.tsx         # 组件源码
└── index.module.scss # 组件样式
```

### Props API

| 属性 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `src` | ✅ 是 | `string` | - | 图片 URL 地址 |
| `alt` | ✅ 是 | `string` | - | 图片替代文本，用于 accessibility 和图片加载失败时显示 |
| `className` | ❌ 否 | `string` | - | 自定义容器 CSS 类名，用于覆盖扩展样式 |
| `rootMargin` | ❌ 否 | `number` | `100` | 提前加载边距（单位：px），在距离视口多少距离时开始预加载 |
| `onLoad` | ❌ 否 | `() => void` | - | 图片加载完成回调函数 |

### 组件特性

- 图片未进入视口前不渲染 img 标签
- 加载完成有淡入过渡动画效果
- 配合原生 `loading="lazy"` 双保障
- 使用 `React.memo` 缓存，避免不必要重渲染

### 使用示例

```tsx
import React from 'react';
import { LazyImage } from '@/components';

const ArticleCover: React.FC<{ coverUrl: string }> = ({ coverUrl }) => {
  return (
    <div className="article-cover">
      <LazyImage
        src={coverUrl}
        alt="文章封面"
        rootMargin={200}
        onLoad={() => console.log('图片加载完成')}
      />
    </div>
  );
};

export default ArticleCover;
```

---

## Loading - 加载提示组件

### 组件介绍

展示 CSS 旋转加载动画，用于页面初始化加载、下拉刷新、提交按钮加载状态等场景。支持三种尺寸和全屏/局部两种模式。

### 目录结构

```
src/components/Loading/
├── index.tsx         # 组件源码
└── index.module.scss # 组件样式
```

### Props API

| 属性 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tip` | ❌ 否 | `string` | `"加载中..."` | 加载提示文本，传入空字符串不显示提示 |
| `size` | ❌ 否 | `"small" \| "middle" \| "large"` | `"large"` | 加载 spinner 尺寸 |
| `className` | ❌ 否 | `string` | - | 自定义容器 CSS 类名 |
| `fullScreen` | ❌ 否 | `boolean` | `true` | 是否铺满全屏展示，`false` 则仅包裹内容高度 |

### 尺寸说明

| 尺寸 | spinner 大小 | 适用场景 |
|------|-------------|----------|
| `small` | 24px | 列表局部加载、按钮内加载 |
| `middle` | 40px | 卡片区域加载 |
| `large` | 60px | 全屏页面加载 |

### 使用示例

```tsx
import React from 'react';
import { Loading } from '@/components';

// 全屏页面加载
const PageLoading: React.FC = () => {
  return <Loading tip="页面加载中..." fullScreen />;
};

// 局部列表加载
const ListLoading: React.FC = () => {
  return (
    <Loading
      tip="加载中..."
      size="small"
      fullScreen={false}
      className="custom-list-loading"
    />
  );
};

export default PageLoading;
```

---

## ErrorFallback - 错误兜底组件

### 组件介绍

用于 `react-error-boundary` 的错误兜底展示组件。当 React 组件树发生渲染错误时，显示友好的降级 UI，并提供**重试**和**刷新页面**两个操作按钮。

### 目录结构

```
src/components/ErrorFallback/
├── index.tsx         # 组件源码
├── index.test.tsx    # 单元测试
└── index.module.scss # 组件样式
```

### Props API

| 属性 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `error` | ✅ 是 | `Error` | - | 捕获到的错误对象，会显示 `error.message` |
| `resetErrorBoundary` | ✅ 是 | `() => void` | - | 重置错误边界的回调函数，由 `react-error-boundary` 自动提供 |
| `className` | ❌ 否 | `string` | - | 自定义容器 CSS 类名 |
| `title` | ❌ 否 | `string` | `"Something Went Wrong"` | 错误标题 |
| `description` | ❌ 否 | `string` | 默认描述 | 错误描述文本 |

### 默认值

- 默认标题：`"Something Went Wrong"`
- 默认描述：`"An unexpected error occurred. Please try again or refresh the page."`

### 使用示例

```tsx
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components';

// 全局根组件使用 - 兜底整个应用
const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes />
    </ErrorBoundary>
  );
};

// 局部动态模块隔离使用
const DynamicModule: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback
          {...props}
          title="模块加载失败"
          description="抱歉，动态模块加载出错，请点击重试刷新"
        />
      )}
    >
      <DynamicContent />
    </ErrorBoundary>
  );
};

export default App;
```

---

## ArticleActionBar - 文章操作栏组件

### 组件介绍

文章详情页底部悬浮互动操作栏，提供**点赞**、**评论**、**分享**、**收藏**四个功能按钮，展示对应数据统计。自动适配 iPhone 安全区域。

### 目录结构

```
src/components/ArticleActionBar/
├── index.tsx         # 组件源码
└── index.module.scss # 组件样式
```

### Props API

| 属性 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| `likeCount` | ✅ 是 | `number` | - | 点赞总数 |
| `commentCount` | ✅ 是 | `number` | - | 评论总数 |
| `isLiked` | ❌ 否 | `boolean` | `false` | 当前用户是否已点赞 |
| `isCollected` | ❌ 否 | `boolean` | `false` | 当前用户是否已收藏 |
| `onLikeClick` | ❌ 否 | `() => void` | - | 点赞按钮点击回调 |
| `onCommentClick` | ❌ 否 | `() => void` | - | 评论按钮点击回调 |
| `onShareClick` | ❌ 否 | `() => void` | - | 分享按钮点击回调 |
| `onCollectClick` | ❌ 否 | `() => void` | - | 收藏按钮点击回调 |

### 交互特性

- 点赞数超过 `1000` 自动格式化为 `X.Xk` 格式显示（例：`1250` → `1.3k`）
- `isLiked`/`isCollected` 为 `true` 时，图标自动高亮变色
- 所有可点击按钮都添加了 `aria-label` 无障碍访问支持
- 组件固定悬浮在屏幕底部，自动适配 `env(safe-area-inset-bottom)`
- 点击有 `:active` 透明度变化反馈

### 使用示例

```tsx
import React from 'react';
import { useObserver } from 'mobx-react';
import { ArticleActionBar } from '@/components';
import { useArticleDetailStore } from './useStore';

const ArticleDetailPage: React.FC = () => {
  const store = useArticleDetailStore();

  return useObserver(() => (
    <div className="articleDetailContainer">
      {/* 文章内容区域 */}
      <ArticleContent data={store.article} />

      {/* 底部操作栏 */}
      <ArticleActionBar
        likeCount={store.article.likeCount}
        commentCount={store.article.commentCount}
        isLiked={store.isLiked}
        isCollected={store.isCollected}
        onLikeClick={store.toggleLike}
        onCommentClick={store.scrollToComment}
        onShareClick={store.handleShare}
        onCollectClick={store.toggleCollect}
      />
    </div>
  ));
};

export default ArticleDetailPage;
```

---

## 附录

### 公共组件设计原则

本项目所有全局公共组件遵循以下设计原则：

1. **纯组件**：所有数据通过 Props 传入，所有交互通过回调输出，不依赖全局 Store 和 API
2. **类型安全**：完整的 TypeScript 类型定义，所有 Props 都有显式接口声明
3. **样式可扩展**：根容器支持 `className` 属性接收外部自定义样式覆盖
4. **移动端优先**：适配触摸交互，点击区域 ≥ 44px，自动适配安全区域
5. **可访问性**：所有无文本按钮都添加了 `aria-label` 无障碍支持

### 项目规范链接

- [公共组件开发规范](./CLAUDE.md) - 查看组件开发规范
- [CSS/SCSS 规范](../../../.claude/rules/frontend-css-scss.md) - 样式开发规范
- [TypeScript 规范](../../../.claude/rules/frontend-typescript.md) - 类型开发规范
