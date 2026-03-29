/**
 * 路由类型定义
 * 扩展 React Router v6 的 RouteObject，添加缓存配置
 */

import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import type { RouteHandleMeta } from './utils';

/**
 * 扩展 IndexRouteObject 添加自定义配置
 */
interface IndexRouteConfig extends Omit<IndexRouteObject, 'handle'> {
  /** 路由元数据，包含完整路径等信息 */
  handle?: RouteHandleMeta;
  /** 是否需要缓存（KeepAlive）*/
  keepAlive?: boolean;
  /** 页面名称（用于日志、标题）*/
  pageName?: string;
  children?: undefined;
}

/**
 * 扩展 NonIndexRouteObject 添加自定义配置
 */
interface NonIndexRouteConfig extends Omit<NonIndexRouteObject, 'handle'> {
  /** 路由元数据，包含完整路径等信息 */
  handle?: RouteHandleMeta;
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
