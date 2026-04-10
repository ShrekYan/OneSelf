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
};
