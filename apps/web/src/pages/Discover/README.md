# Discover 发现模块

发现模块是应用的主要内容浏览入口，采用嵌套路由结构，底部导航栏在顶层持久化保留，切换子页面时不重新挂载。

## 目录结构

```
src/pages/Discover/
├── README.md               # 本文档
├── MainLayout.tsx         # 主布局组件（包含 BottomNav + Outlet）
├── index.tsx              # 模块入口
├── index.module.scss      # 全局样式
├── components/
│   └── bottom-nav/        # 底部导航栏组件（顶层公共组件）
│       ├── index.tsx
│       ├── constant.ts
│       └── index.module.scss
└── routes/                 # 子路由页面（每个子页完全自治
    ├── home/              # 首页 - 文章列表
    │   ├── index.tsx
    │   ├── useStore.ts    # 页面级 MobX 状态管理
    │   ├── constant.ts    # 类型定义和模拟数据
    │   ├── handle.ts      # 业务处理函数
    │   ├── index.module.scss
    │   └── components/     # Home 页面私有组件
    │       ├── top-bar/        # 顶部导航栏
    │       ├── category-tabs/  # 分类标签栏
    │       ├── featured-article/ # 特色文章大图卡片
    │       └── article-list-item/ # 文章列表项
    ├── explore/            # 探索页 - 占位（待开发）
    ├── saved/              # 收藏页 - 占位（待开发）
    └── profile/            # 个人页 - 占位（待开发）
```

## 架构设计

### 路由结构

```
/discover
├── /discover/home      ← 首页（文章流）
├── /discover/explore   ← 探索发现
├── /discover/saved     ← 我的收藏
└── /discover/profile   ← 个人中心

- 底部导航栏在 `/discover` 主路由层渲染，所有子页面切换时保持常驻不销毁
- 使用 React Router `<Outlet />` 渲染子路由内容
- 每个子页面完全自治，自己管理状态、组件和依赖

## 数据流

1. **Home 页面（首页）**：
   - 使用 MobX `useLocalObservable` 做页面级状态管理
   - 支持下拉刷新、下拉加载更多
   - 支持文章点赞、收藏状态切换
   - 目前使用模拟数据，后续接入真实 API

2. **Explore / Saved / Profile**：
   - 目前为空占位组件
   - 后续开发时，每个页面自己管理状态和 API，不共享

## 主要组件

### 顶层公共组件

| 组件 | 位置 | 功能 |
|------|------|------|
| `BottomNav` | `components/bottom-nav` | 底部导航栏，从 URL 路径判断当前激活项 |
| `MainLayout` | `./MainLayout.tsx` | 主布局，渲染 Outlet + BottomNav |

### Home 页面私有组件

| 组件 | 位置 | 功能 |
|------|------|------|
| `TopBar` | `routes/home/components/top-bar` | 顶部导航栏，显示标题、搜索按钮、通知按钮 |
| `CategoryTabs` | `routes/home/components/category-tabs` | 横向滚动分类标签，支持切换筛选 |
| `FeaturedArticle` | `routes/home/components/featured-article` | 特色文章大图卡片，展示置顶推荐文章 |
| `ArticleListItem` | `routes/home/components/article-list-item` | 文章列表项，左侧图片+右侧文字布局 |

## 状态管理

Home 页面使用页面级 MobX Store，定义在 `routes/home/useStore.ts`：

**主要状态：
- `activeCategoryId` - 当前激活分类 ID
- `featuredArticle` - 特色文章数据
- `articleList` - 文章列表
- `loading / refreshing / loadingMore` - 各种加载状态
- `hasMore` - 是否还有更多数据
- `page` - 当前页码

**主要方法：**
- `fetchArticles()` - 首次获取文章列表
- `refreshArticles()` - 下拉刷新
- `loadMoreArticles()` - 加载更多
- `toggleLike(articleId)` - 切换点赞状态
- `toggleSave(articleId)` - 切换收藏状态

## 交互特性

- ✅ 下拉刷新 (PullToRefresh)
- ✅ 无限加载 (InfiniteScroll)
- ✅ 图片懒加载
- ✅ 点击文章卡片跳转详情
- ✅ 点赞/收藏交互即时反馈
- ✅ 分类切换高亮当前激活项
- ✅ 底部导航从 URL 自动同步激活状态

## 移动端适配

- 设计稿基于 750px 宽度，使用 `postcss-px-to-viewport` 自动转 vw
- 底部导航预留安全区域 `env(safe-area-inset-bottom)` 适配 iPhone 小黑条
- 点击热区满足最小 44px 尺寸
- 列表图片懒加载优化性能

## 待开发

- [ ] Explore 探索页面内容
- [ ] Saved 收藏页面内容
- [ ] Profile 个人页面内容
- [ ] 接入真实文章列表 API
