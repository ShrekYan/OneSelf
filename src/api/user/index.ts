/**
 * 用户相关 API 接口
 * @description 用户信息、个人中心相关接口
 */
import { api } from '@/api';

/**
 * 用户统计数据接口
 */
export interface UserStats {
  followers: number;
  following: number;
  totalLikes: number;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  userName: string;
  userHandle: string;
  userBio: string;
  avatarUrl: string;
  stats: UserStats;
}

/**
 * 获取用户信息响应
 */
export interface GetUserInfoResponse {
  userInfo: UserInfo;
}

/**
 * 更新用户信息请求参数
 */
export interface UpdateUserInfoParams {
  userName?: string;
  userHandle?: string;
  userBio?: string;
  avatarUrl?: string;
}

/**
 * 更新用户信息响应
 */
export interface UpdateUserInfoResponse {
  success: boolean;
  userInfo: UserInfo;
}

/**
 * 发送验证码请求参数
 */
export interface SendCodeParams {
  mobile: string;
  type: 'register' | 'login' | 'reset';
}

/**
 * 注册请求参数（API 层只接收这三个字段，confirmPassword 在前端表单完成校验后不需要传入 API）
 */
export interface RegisterParams {
  mobile: string;
  code: string;
  password: string;
}

/**
 * 用户信息 DTO（注册响应返回，与后端保持一致）
 */
export interface UserDto {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  nickname?: string;
}

/**
 * 注册响应（与后端 RegisterResponseDto 保持一致）
 */
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserDto;
}

/**
 * 登录请求参数（与后端 LoginDto 保持一致）
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应（与后端 LoginResponseDto 保持一致，结构同注册响应）
 */
export type LoginResponse = RegisterResponse;

/**
 * 用户 API 模块
 */
export const userApi = {
  /**
   * 获取当前用户信息
   */
  getUserInfo: async (): Promise<GetUserInfoResponse> => {
    return await api.get('/api/v1/user/info');
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: async (
    data: UpdateUserInfoParams,
  ): Promise<UpdateUserInfoResponse> => {
    return await api.put('/api/v1/user/info', data);
  },

  /**
   * 退出登录
   */
  signOut: async (): Promise<{ success: boolean }> => {
    return await api.post('/api/v1/auth/logout');
  },

  /**
   * 发送验证码
   */
  sendCode: async (
    params: SendCodeParams,
  ): Promise<{ success: boolean; message?: string }> => {
    return await api.post('/api/v1/auth/send-code', params);
  },

  /**
   * 用户注册
   * 前端表单完成验证码和密码确认校验后，仅发送 mobile + password 给后端（与后端接口对齐）
   */
  register: async (params: RegisterParams): Promise<RegisterResponse> => {
    // 只提取后端需要的字段，code 留在前端做校验
    const requestBody = {
      mobile: params.mobile,
      password: params.password,
    };
    return await api.post('/api/v1/auth/register', requestBody);
  },

  /**
   * 用户登录
   * 与后端 LoginDto 保持一致，发送 username + password
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return await api.post('/api/v1/auth/login', data);
  },
};
