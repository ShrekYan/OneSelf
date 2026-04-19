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
  pageName: '页面名称',        // 顶层配置（也可以只放 handle 中）
  handle: {
    pageName: '页面名称',   // 用于标题、日志
    keepAlive: false,     // 是否缓存：Tab 页 true，其他 false
  },
  // fullPath 由 enhanceRoutes 自动生成，不需要手动配置！
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

### 6. 类型扩展与类型安全

`RouteConfig` 在 React Router `RouteObject` 基础上扩展，通过 `Omit` 移除原有 `handle` 并重新定义，保证完全类型安全：

```ts
// types.ts 中的类型定义结构
import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import type { RouteHandleMeta } from './utils';

interface IndexRouteConfig extends Omit<IndexRouteObject, 'handle'> {
  handle?: RouteHandleMeta;
  keepAlive?: boolean;
  pageName?: string;
  children?: undefined;
}

interface NonIndexRouteConfig extends Omit<NonIndexRouteObject, 'handle'> {
  handle?: RouteHandleMeta;
  keepAlive?: boolean;
  pageName?: string;
  children?: RouteConfig[];
}

export type RouteConfig = IndexRouteConfig | NonIndexRouteConfig;
```

**RouteHandleMeta 结构**:
```ts
export interface RouteHandleMeta {
  fullPath?: string;  // ✅ 自动生成，不需要手动填写
  pageName?: string;  // 页面名称
  keepAlive?: boolean;// 是否缓存
}
```

### 7. 类型安全最佳实践 (避开 @typescript-eslint/no-unsafe-assignment)

| 问题场景 | 错误原因 | 规避方式 |
|----------|----------|----------|
| `RouteConfigInfo` | `Pick<RouteConfig, ...>` 从联合类型 Pick 导致类型不安全 | 直接定义独立接口，不要从联合类型 Pick |
| `handle` 字段 | React Router 原生 `handle` 是 `unknown` 类型 | 必须用 `Omit` 移除原类型重新定义 |
| `route.handle` 展开 | `route.handle` 可能为 `undefined` | 使用 `...(route.handle || {})` 兜底 |

**RouteInterceptor 中 RouteConfigInfo 正确写法**:
```ts
// ❌ 错误 - 从联合类型 Pick 导致不安全赋值
export type RouteConfigInfo = Pick<RouteConfig, 'path' | 'pageName' | 'keepAlive'>;

// ✅ 正确 - 直接定义接口
export interface RouteConfigInfo {
  path: string;
  pageName?: string;
  keepAlive?: boolean;
}
```

## ✅ 检查清单

- [ ] 是否按业务模块正确拆分到 `modules/`？
- [ ] 是否同时嵌套 `RouteInterceptor` + `KeepAliveLayout`？
- [ ] `handle` 是否包含 `pageName` 和 `keepAlive`？
- [ ] `fullPath` 是否**没有**手动填写（由 `enhanceRoutes` 自动生成）？
- [ ] `keepAlive` 是否按场景正确设置（仅 Tab 为 true）？
- [ ] 非 Tab 页面是否使用 `React.lazy` 懒加载？
- [ ] 新模块是否已在 `index.tsx` 导入合并？
- [ ] 是否避免了从 `RouteConfig` 联合类型 `Pick` 字段？
