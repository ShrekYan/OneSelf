/**
 * 路由缓存类型定义
 */

import type React from 'react';

/** 路由缓存配置 */
export interface RouteCacheConfig {
  /** 是否默认启用缓存 */
  keepAlive: boolean;
  /** 最大缓存数量，超出后淘汰最久未使用 */
  maxCacheCount: number;
  /** 默认需要缓存的路径匹配 */
  defaultCacheablePaths?: string[];
}

/** 默认配置 */
export const defaultRouteCacheConfig: RouteCacheConfig = {
  keepAlive: false,
  maxCacheCount: 5, // 移动端最多缓存 5 个页面，控制内存占用
  defaultCacheablePaths: ['/home', '/explore', '/profile'],
};

/** 缓存条目 */
export interface CacheEntry {
  /** 缓存 key（使用 pathname 或自定义 key） */
  key: string;
  /** 路由元素 */
  element: React.ReactElement;
  /** 最后访问时间 */
  lastAccessedAt: number;
  /** 是否当前激活 */
  isActive: boolean;
}

/** 路由缓存上下文 */
export interface RouteCacheContextValue {
  /** 当前缓存的所有条目 */
  cacheEntries: Map<string, CacheEntry>;
  /** 获取缓存条目 */
  getCacheEntry: (key: string) => CacheEntry | undefined;
  /** 添加/更新缓存条目 */
  setCacheEntry: (
    key: string,
    element: React.ReactElement,
    isActive: boolean,
  ) => void;
  /** 删除指定缓存条目 */
  deleteCacheEntry: (key: string) => void;
  /** 清空所有缓存 */
  clearCache: () => void;
  /** 标记当前激活的路由 */
  setActiveRoute: (currentKey: string) => void;
  /** 检查路由是否需要缓存（来自路由 meta） */
  shouldCache: (pathname: string) => boolean;
}

/** CachedRoute Props */
export interface CachedRouteProps {
  /** 要缓存的路由元素 */
  element: React.ReactElement;
  /** 自定义缓存 key，默认使用 pathname */
  cacheKey?: string;
  /** 是否启用缓存，优先级高于全局配置 */
  keepAlive?: boolean;
}

/** CachedOutlet Props */
export interface CachedOutletProps {
  /** 默认是否缓存所有子路由，如果路由 meta 指定了则覆盖 */
  defaultKeepAlive?: boolean;
}
