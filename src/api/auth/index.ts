import api from '../core/axios-instance';

/**
 * 刷新令牌请求参数
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 刷新令牌响应数据
 */
export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

import type { RequestConfig } from '../core/types';

/**
 * 使用刷新令牌获取新的访问令牌
 * @param refreshToken - 刷新令牌
 * @returns 新的访问令牌信息
 */
export async function refreshToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  return await api.post('/auth/refresh', { refreshToken }, {
    skipErrorToast: true,
  } as RequestConfig);
}

/**
 * 用户登出
 * @returns 登出结果
 */
export async function logout(): Promise<{ message: string }> {
  return await api.post('/auth/logout', {});
}
