# 路由配置规范

基于 React Router v6 + react-activation 实现的路由架构。

## 📁 目录结构

```
src/routes/
├── CLAUDE.md          # 本文档
├── index.tsx          # 主入口：合并所有模块，导出 AppRouter
├── types.ts           # 类型定义：扩展 RouteConfig
├── utils.ts           # 工具函数：enhanceRoutes 自动补全 fullPath
├── components/
│   ├── RouteInterceptor.tsx  # 路由守卫（登录校验、权限）
│   └── KeepAliveLayout.tsx   # KeepAlive 缓存布局包装器
└── modules/           # 按业务模块拆分路由
    ├── public.routes.tsx
    ├── discover.routes.tsx
    └── article.routes.tsx
```

## 🎯 核心规则

### 1. 模块化拆分

| 原则 | 说明 |
|------|------|
| **按业务拆分** | 每个业务领域一个模块文件，如 `discover.routes.tsx` |
| **统一合并** | 所有模块在 `index.tsx` 合并后导出 |
| **命名规范** | 模块文件：`{module}.routes.tsx`，导出：`{module}Routes` |

### 2. 单条路由配置模板

```tsx
import React from 'react';
import type { RouteConfig } from '@/routes/types';
import { RouteInterceptor } from '@/routes/components/RouteInterceptor';
import { KeepAliveLayout } from '@/routes/components/KeepAliveLayout';

const PageComponent = React.lazy(() => import('@/pages/PageComponent'));

const routeItem: RouteConfig = {
  path: '/path',
  element: (
    <RouteInterceptor
      routeConfig={{ path: '/path', pageName: '页面名称', keepAlive: false }}
    >
      <KeepAliveLayout keepAlive={false} cacheKey="/path">
        <PageComponent />
      </KeepAliveLayout>
    </RouteInterceptor>
  ),
  handle: {
    pageName: '页面名称',   // 用于标题、日志
    keepAlive: false,     // 是否缓存：Tab 页 true，其他 false
  },
};
```

### 3. KeepAlive 缓存策略

| 场景 | keepAlive |
|------|-----------|
| 底部 Tab 切换页面 (home/explore/profile) | `true` |
| 详情页、登录页、静态页等 | `false` |

> Tab 页面使用缓存保留滚动位置和状态，提升用户体验。

### 4. 懒加载

- **非 Tab 页面**：使用 `React.lazy` 懒加载
- **Tab 页面**：直接导入（预加载，提升切换体验）

### 5. 必须嵌套两层包装

```
RouteInterceptor (路由守卫)
  └── KeepAliveLayout (缓存控制)
        └── PageComponent (页面组件)
```

| 组件 | 职责 |
|------|------|
| `RouteInterceptor` | 登录校验、权限检查、日志埋点 |
| `KeepAliveLayout` | 根据 `keepAlive` 决定是否启用缓存 |

### 6. 类型扩展

`RouteConfig` 在 React Router `RouteObject` 基础上扩展：

```ts
interface RouteConfig {
  keepAlive?: boolean;      // 是否需要缓存
  pageName?: string;        // 页面名称（用于标题、日志）
  children?: RouteConfig[]; // 支持嵌套路由
}
```

## ✅ 检查清单

- [ ] 是否按业务模块正确拆分到 `modules/`？
- [ ] 是否同时嵌套 `RouteInterceptor` + `KeepAliveLayout`？
- [ ] `handle` 是否包含 `pageName` 和 `keepAlive`？
- [ ] `keepAlive` 是否按场景正确设置（仅 Tab 为 true）？
- [ ] 非 Tab 页面是否使用 `React.lazy` 懒加载？
- [ ] 新模块是否已在 `index.tsx` 导入合并？
