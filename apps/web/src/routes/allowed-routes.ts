/**
 * 从路由配置动态生成允许的路由前缀白名单
 * 用于安全重定向验证
 */

import { enhanceRoutes, flattenRoutes } from './utils';
import { discoverRoutes } from './modules/discover.routes';
import { articleRoutes } from './modules/article.routes';
import { publicRoutes } from './modules/public.routes';

// 合并所有路由配置
const allRoutes = [...discoverRoutes, ...articleRoutes, ...publicRoutes];

// 先增强路由（生成完整路径 fullPath），再扁平化
const enhancedRoutes = enhanceRoutes(allRoutes);
const flattened = flattenRoutes(enhancedRoutes);

/**
 * 允许的路由前缀白名单
 * 使用 fullPath 获得完整路径，过滤掉动态参数路由（包含 :）、通配符路由（*）和空路径
 */
export const ALLOWED_ROUTE_PREFIXES = flattened
  .map(route => route.handle?.fullPath)
  .filter(
    (path): path is string =>
      typeof path === 'string' &&
      !path.includes(':') &&
      path !== '*' &&
      path !== '' &&
      path !== '/',
  );
