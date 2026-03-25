/**
 * API 模块入口文件
 * 统一导出所有 API 相关类型、实例、工具方法以及各业务模块
 */

import { productApi } from './product';

// 导出核心类型定义
export type { ApiResponse, RequestConfig, RequestMethod } from './core/types';
export { ErrorType, ApiError } from './core/types';

// 导出核心类
export { RequestCache } from './core/request-cache';
export { CancelManager } from './core/cancel-manager';

// 导出 Axios 实例和管理器
export { default as api, cache, cancelManager } from './core/axios-instance';
export { apiUtils } from './core/api-utils';

// 导出各业务模块 API
export { productApi };

// 默认导出包含所有 API 模块的对象
export default {
  product: productApi,
};
