/**
 * 路由主入口
 * 导出增强后的路由配置，供 App.tsx 使用 useRoutes 渲染
 */

import { useRoutes } from 'react-router-dom';
import { enhanceRoutes } from './utils';
import { discoverRoutes } from './modules/discover.routes';
import { articleRoutes } from './modules/article.routes';
import { publicRoutes } from './modules/public.routes';
import type { RouteConfig } from './types';

// 合并所有路由并增强（自动生成 fullPath 到 handle）
const allRoutes: RouteConfig[] = [
  ...discoverRoutes,
  ...articleRoutes,
  ...publicRoutes,
];
const enhancedRoutes = enhanceRoutes(allRoutes);

/**
 * 应用路由器组件
 * 包裹 AliveScope 支持 react-activation
 * 使用 useRoutes 渲染路由，外层已经有 BrowserRouter 在 main.tsx
 */
export function AppRouter() {
  const element = useRoutes(enhancedRoutes);
  return element;
}
