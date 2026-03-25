/**
 * 请求缓存类
 * 用于缓存 GET 请求的响应数据
 */
export class RequestCache {
  private cache = new Map<string, { data: unknown; expireTime: number }>();

  /**
   * 设置缓存
   * @param key - 缓存键
   * @param data - 缓存数据
   * @param ttl - 缓存时间（毫秒），默认 60 秒
   */
  set(key: string, data: unknown, ttl: number = 60000) {
    this.cache.set(key, {
      data,
      expireTime: Date.now() + ttl,
    });
  }

  /**
   * 获取缓存
   * @param key - 缓存键
   * @returns 缓存数据，如果不存在或已过期返回 null
   */
  get<T = unknown>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expireTime) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 清除所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 删除指定缓存
   * @param key - 缓存键
   */
  delete(key: string) {
    this.cache.delete(key);
  }
}
