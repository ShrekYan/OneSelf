/**
 * API 模块入口文件
 * 统一导出所有 API 相关类型、实例、工具方法以及各业务模块
 */

import { productApi } from './product';
import { userApi } from './user';
import { articleApi } from './article';
import { categoryApi } from './category';
import type { AxiosInstance } from 'axios';

// 导出核心类型定义
export type { ApiResponse, RequestConfig, RequestMethod } from './core/types';
export { ErrorType, ApiError } from './core/types';

// 导出核心类
export { RequestCache } from './core/request-cache';
export { CancelManager } from './core/cancel-manager';

// 导出 Axios 实例和管理器
export { default as api, cache, cancelManager } from './core/axios-instance';
export { apiUtils } from './core/api-utils';
import api from './core/axios-instance';

// 导出各业务模块 API
export { productApi, userApi, articleApi, categoryApi };

/**
 * 默认导出对象聚合 axios 实例 和 所有业务模块 API
 * 使用方式:
 * - import api from '@/api';  - api.get(...) 调用接口
 * - import api from '@/api';  - api.category.getHotKeywords() 调用业务 API
 */
interface DefaultApi extends AxiosInstance {
  product: typeof productApi;
  user: typeof userApi;
  article: typeof articleApi;
  category: typeof categoryApi;
}

const defaultApi = api as DefaultApi;
defaultApi.product = productApi;
defaultApi.user = userApi;
defaultApi.article = articleApi;
defaultApi.category = categoryApi;

export default defaultApi;
