/**
 * 安全存储工具
 * 使用 Base64 简单编码防止明文泄露，浏览器关闭自动清除
 * 注意：这不是真正的加密，仅用于防肉眼读取
 */

/**
 * 编码数据（Base64 + URI 编码）
 */
const encode = (data: unknown): string => {
  return btoa(encodeURIComponent(JSON.stringify(data)));
};

/**
 * 解码数据
 */
const decode = <T>(str: string): T => {
  return JSON.parse(decodeURIComponent(atob(str))) as T;
};

/**
 * 安全的 sessionStorage 操作
 */
export const secureSessionStorage = {
  /**
   * 存储数据（自动编码）
   * @param key - 存储键名
   * @param value - 要存储的数据
   */
  set<T>(key: string, value: T): void {
    try {
      const encoded = encode(value);
      sessionStorage.setItem(key, encoded);
    } catch {
      // 忽略存储错误（如隐私模式、配额超限）
    }
  },

  /**
   * 获取数据（自动解码）
   * @param key - 存储键名
   * @returns 解析后的数据，不存在或解析失败返回 null
   */
  get<T>(key: string): T | null {
    try {
      const str = sessionStorage.getItem(key);
      if (!str) return null;
      return decode<T>(str);
    } catch {
      return null;
    }
  },

  /**
   * 删除数据
   * @param key - 存储键名
   */
  remove(key: string): void {
    sessionStorage.removeItem(key);
  },

  /**
   * 清空所有存储的数据
   */
  clear(): void {
    sessionStorage.clear();
  },
};
