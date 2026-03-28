/**
 * 路由主入口
 * 导出增强后的路由配置，供 App.tsx 使用 useRoutes 渲染
 */

import { useRoutes } from 'react-router-dom';
import { enhanceRoutes } from './utils';
import discoverRoutes from './modules/discover.routes.tsx';
import articleRoutes from './modules/article.routes.tsx';
import publicRoutes from './modules/public.routes.tsx';
import type { RouteConfig } from './types';

// 合并所有路由并增强（自动生成 fullPath 到 handle）
const enhancedRoutes: RouteConfig[] = enhanceRoutes([
  ...discoverRoutes,
  ...articleRoutes,
  ...publicRoutes,
]);

/**
 * 应用路由器组件
 * 包裹 AliveScope 支持 react-activation
 * 使用 useRoutes 渲染路由，外层已经有 BrowserRouter 在 main.tsx
 */
export function AppRouter() {
  const element = useRoutes(enhancedRoutes);
  return element;
}
