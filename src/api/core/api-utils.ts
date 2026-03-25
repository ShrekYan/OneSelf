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
   * 设置 token
   * @param token - 认证令牌
   */
  setToken: (token: string) => {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  },

  /**
   * 清除 token
   */
  clearToken: () => {
    delete api.defaults.headers.Authorization;
    localStorage.removeItem('token');
  },
};
