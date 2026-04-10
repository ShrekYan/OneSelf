import { useLocalObservable } from 'mobx-react';
import { authApi } from '@/api';
import type { LoginFormData } from './schema';
import type { LoginResponse } from '@/api/auth';

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean;
  message?: string;
}

/**
 * 登录页面状态管理接口
 */
export interface LoginStoreType {
  // 状态数据
  isLoading: boolean;
  showPassword: boolean;

  // Setter 方法
  setLoading: (loading: boolean) => void;
  togglePasswordVisibility: () => void;

  // 业务方法
  login: (formData: LoginFormData) => Promise<LoginApiResponse>;
}

/**
 * 移动端登录模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含登录功能
 * 表单验证由 react-hook-form 处理
 */
export const useLoginStore = () => {
  const store = useLocalObservable<LoginStoreType>(() => ({
    isLoading: false,
    showPassword: false,

    /**
     * 设置加载状态
     * @param loading - 加载状态
     */
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    /**
     * 切换密码可见性
     */
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    /**
     * 登录处理
     * @param formData - 表单数据（已通过验证）
     * @returns Promise
     */
    async login(formData: LoginFormData) {
      this.isLoading = true;

      try {
        const result: LoginResponse = await authApi.login(
          {
            username: formData.username,
            password: formData.password,
          },
          {
            skipAuth: true, // 登录接口不需要认证
            skipErrorToast: true, // 不使用拦截器自动提示，我们自己处理
          },
        );

        // 拦截器已经过滤，能走到这里说明 code === 200
        // 保存 token 和用户信息到 localStorage（与注册页保持一致）
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(result.user));

        this.isLoading = false;
        return {
          success: true,
        };
      } catch (error) {
        console.error('Login failed:', error);
        this.isLoading = false;
        // code !== 200 会被拦截器 reject，进入这里
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Login failed',
        };
      }
    },
  }));

  return store;
};
