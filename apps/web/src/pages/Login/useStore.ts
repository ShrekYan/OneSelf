import { useLocalObservable } from 'mobx-react';
import { authApi } from '@/api';
import { secureSessionStorage } from '@/utils/secure-storage';
import type { LoginFormData, LoginApiResponse } from './types';
import type { LoginResponse } from '@/api/auth';

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
        // ✅ Token 由后端通过 HttpOnly Cookie 设置，前端不存储（防 XSS 攻击）
        // ✅ userInfo 编码后存储在 sessionStorage，浏览器关闭时自动清除
        secureSessionStorage.set('userInfo', result.user);

        this.isLoading = false;
        return {
          success: true,
        };
      } catch (error) {
        // 生产环境不输出详细错误堆栈
        if (import.meta.env.DEV) {
          console.error('Login failed:', error);
        }
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
