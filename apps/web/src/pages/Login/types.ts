/**
 * 登录页面类型定义
 */
import type { LoginFormData } from './schema';

export type { LoginFormData };

/**
 * 登录 API 响应结果
 */
export interface LoginApiResponse {
  success: boolean;
  message?: string;
}
