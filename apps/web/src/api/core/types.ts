import type { AxiosRequestConfig } from 'axios';
import type { AxiosError } from 'axios';

/**
 * API 响应类型
 * @template T - 数据类型
 */
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
  timestamp?: number;
}

/**
 * 请求配置扩展类型
 */
export type RequestConfig = AxiosRequestConfig & {
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟(ms)
  skipErrorToast?: boolean; // 跳过错误提示
  skipAuth?: boolean; // 跳过认证
  cache?: boolean; // 是否缓存
  cacheTime?: number; // 缓存时间(ms)
  __retryCount?: number; // 内部重试计数
  __isRetry?: boolean; // 标记是否是刷新后的重试
};

/**
 * HTTP 请求方法类型
 */
export type RequestMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

/**
 * 错误类型枚举
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  ABORT = 'ABORT',
  SERVER = 'SERVER',
  BUSINESS = 'BUSINESS',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  type: ErrorType;
  code?: number;
  originalError?: AxiosError;

  constructor(
    message: string,
    type: ErrorType,
    code?: number,
    originalError?: AxiosError,
  ) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.code = code;
    this.originalError = originalError;
  }
}
