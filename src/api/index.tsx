/**
 * API 模块入口文件
 * 统一导出所有 API 相关类型、实例和工具方法
 */

// 导出类型定义
export type { ApiResponse, RequestConfig, RequestMethod } from './types'
export type { ErrorType } from './types'
export { ApiError } from './types'

// 导出核心类
export { RequestCache } from './request-cache'
export { CancelManager } from './cancel-manager'

// 导出 Axios 实例和管理器
export { default as api, cache, cancelManager } from './axios-instance'
export { apiUtils } from './api-utils'
