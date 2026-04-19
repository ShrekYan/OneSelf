/**
 * 路由拦截器
 * - 权限认证检查
 * - 缓存清理策略
 */

import React from 'react';

/**
 * 路由配置信息，只需要 RouteConfig 的必要字段
 */
export interface RouteConfigInfo {
  path: string;
  pageName?: string;
  keepAlive?: boolean;
}

export interface RouteInterceptorProps {
  routeConfig: RouteConfigInfo;
  children: React.ReactElement;
}

/**
 * 路由拦截器
 * 预留权限检查和缓存清理的扩展点
 * 当前项目未需要权限拦截，直接返回 children
 */
export const RouteInterceptor: React.FC<RouteInterceptorProps> = ({
  children,
}) => {
  // 这里可以扩展：
  // 1. 权限检查，如果未登录跳转到登录
  // 2. 清理非 Tab 页面缓存
  return children;
};
