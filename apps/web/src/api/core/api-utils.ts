import api, { cache, cancelManager } from './axios-instance';

/**
 * API 工具方法集合
 */
export const apiUtils = {
  /**
   * 清除所有缓存
   */
  clearCache: () => cache.clear(),

  /**
   * 删除指定缓存
   * @param key - 缓存键
   */
  deleteCache: (key: string) => cache.delete(key),

  /**
   * 取消所有请求
   */
  cancelAllRequests: () => cancelManager.cancelAll(),

  /**
   * 设置基础 URL
   * @param url - 基础 URL
   */
  setBaseURL: (url: string) => {
    api.defaults.baseURL = url;
  },

  /**
   * 设置 token（向后兼容，仅用于设置默认 headers，不存储到 localStorage）
   * ✅ Token 通过 HttpOnly Cookie 自动携带，防止 XSS 攻击
   * @param token - 认证令牌
   */
  setToken: (token: string) => {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  },

  /**
   * 清除 token（向后兼容）
   */
  clearToken: () => {
    delete api.defaults.headers.Authorization;
  },
};
