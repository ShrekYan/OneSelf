/**
 * 路由缓存工具函数
 */

import type { CacheEntry } from './types';

/**
 * LRU 淘汰最久未使用的缓存条目
 * @param entries 当前所有缓存条目
 * @param maxCount 最大允许数量
 * @returns 需要删除的 key 数组
 */
export function getLRUKeysToEvict(
  entries: Map<string, CacheEntry>,
  maxCount: number,
): string[] {
  if (entries.size <= maxCount) {
    return [];
  }

  // 转换为数组并按最后访问时间排序（升序，最久未使用在前）
  const sortedEntries = Array.from(entries.entries()).sort(
    (a, b) => a[1].lastAccessedAt - b[1].lastAccessedAt,
  );

  // 计算需要删除的数量
  const needDeleteCount = sortedEntries.length - maxCount;

  // 返回需要删除的 key 数组
  return sortedEntries.slice(0, needDeleteCount).map(([key]) => key);
}

/**
 * 从路由 handle 中获取 keepAlive 配置
 * 兼容 react-router-dom v6 的 handle 字段
 */
export function getKeepAliveFromHandle(
  handle: unknown,
  defaultVal: boolean,
): boolean {
  if (handle && typeof handle === 'object' && 'keepAlive' in handle) {
    const keepAlive = (handle as { keepAlive: unknown }).keepAlive;
    if (typeof keepAlive === 'boolean') {
      return keepAlive;
    }
  }
  return defaultVal;
}
