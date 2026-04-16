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

/**
 * 发送验证码请求参数
 */
export interface SendCodeParams {
  mobile: string;
  type: 'register' | 'login' | 'reset';
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  mobile: string;
  code: string;
  password: string;
}

/**
 * 用户信息 DTO
 */
export interface UserDto {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  nickname?: string;
}

/**
 * 注册响应
 */
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应
 */
export type LoginResponse = RegisterResponse;

import type { RequestConfig } from '../core/types';

/**
 * 使用刷新令牌获取新的访问令牌
 * @param refreshToken - 刷新令牌
 * @returns 新的访问令牌信息
 */
export async function refreshToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  return await api.post('/api/v1/auth/refresh', { refreshToken }, {
    skipErrorToast: true,
  } as RequestConfig);
}

/**
 * 用户登出
 * @param refreshToken - 刷新令牌（可选）
 * @returns 登出结果
 */
export async function logout(
  refreshToken?: string,
): Promise<{ message: string }> {
  return await api.post('/api/v1/auth/logout', { refreshToken });
}

/**
 * 发送验证码
 * @param params - 发送验证码参数
 * @returns 发送结果
 */
export async function sendCode(
  params: SendCodeParams,
): Promise<{ success: boolean; message?: string }> {
  return await api.post('/api/v1/auth/send-code', params);
}

/**
 * 用户注册
 * 前端表单完成验证码和密码确认校验后，仅发送 mobile + password 给后端
 */
export async function register(
  params: RegisterParams,
  config?: RequestConfig,
): Promise<RegisterResponse> {
  // 只提取后端需要的字段，code 留在前端做校验
  const requestBody = {
    mobile: params.mobile,
    password: params.password,
  };
  return await api.post('/api/v1/auth/register', requestBody, config);
}

/**
 * 用户登录
 * 与后端 LoginDto 保持一致，发送 username + password
 */
export async function login(
  data: LoginRequest,
  config?: RequestConfig,
): Promise<LoginResponse> {
  return await api.post('/api/v1/auth/login', data, config);
}
