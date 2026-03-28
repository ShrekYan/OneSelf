import { useLocalObservable } from 'mobx-react';
import type { LoginFormData } from './schema';

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean;
  token?: string;
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
 * 模拟登录 API 请求
 * @param formData - 登录表单数据
 * @returns Promise<LoginApiResponse>
 */
const mockLoginApi = async (
  formData: LoginFormData,
): Promise<LoginApiResponse> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800));

  // 这里可以添加模拟验证逻辑
  console.log('Mock login API called with:', formData);

  // 默认返回成功
  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    message: 'Login successful',
  };
};

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
        const result = await mockLoginApi(formData);
        this.isLoading = false;
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        this.isLoading = false;
        throw error;
      }
    },
  }));

  return store;
};
