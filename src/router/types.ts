/**
 * 路由类型定义
 * 扩展 React Router v6 的 RouteObject，添加缓存配置
 */

import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

/**
 * 扩展 IndexRouteObject 添加自定义配置
 */
interface IndexRouteConfig extends IndexRouteObject {
  /** 是否需要缓存（KeepAlive）*/
  keepAlive?: boolean;
  /** 页面名称（用于日志、标题）*/
  pageName?: string;
  children?: undefined;
}

/**
 * 扩展 NonIndexRouteObject 添加自定义配置
 */
interface NonIndexRouteConfig extends NonIndexRouteObject {
  /** 是否需要缓存（KeepAlive）*/
  keepAlive?: boolean;
  /** 页面名称（用于日志、标题）*/
  pageName?: string;
  children?: RouteConfig[];
}

/**
 * 路由配置类型，正确扩展 React Router v6 的类型
 */
export type RouteConfig = IndexRouteConfig | NonIndexRouteConfig;
