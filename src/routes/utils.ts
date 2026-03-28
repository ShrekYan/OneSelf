/**
 * 路由工具函数
 */

import type { RouteConfig } from './types';

/**
 * 路由元数据，自动添加到 handle 中
 */
export interface RouteHandleMeta {
  fullPath: string;
  pageName?: string;
  keepAlive?: boolean;
}

/**
 * 自动生成完整路径（用于缓存 key）
 * 将父路径和当前路径拼接，得到完整的访问路径
 */
export const enhanceRoutes = (
  routes: RouteConfig[],
  parentPath = '',
): RouteConfig[] => {
  return routes.map((route): RouteConfig => {
    const currentPath = route.path ?? '';
    const fullPath = (parentPath + '/' + currentPath).replace(/\/+/g, '/');
    // 创建新的 handle 对象，添加元数据
    const newHandle: RouteHandleMeta = {
      ...(route.handle as RouteHandleMeta),
      fullPath,
      pageName: route.pageName,
      keepAlive: route.keepAlive,
    };

    // 对于 index 路由（没有 children）
    if ('index' in route && route.index) {
      return {
        ...route,
        handle: newHandle,
      };
    }

    // 有 children 的普通路由
    const children =
      'children' in route && route.children
        ? enhanceRoutes(route.children, fullPath || '')
        : undefined;

    return {
      ...route,
      handle: newHandle,
      children,
    };
  });
};

/**
 * 扁平化路由数组，用于后续处理
 */
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const result: RouteConfig[] = [];

  const process = (route: RouteConfig) => {
    result.push(route);
    if (route.children) {
      route.children.forEach(process);
    }
  };

  routes.forEach(process);
  return result;
};
