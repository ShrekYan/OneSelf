import { runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import type { LoginFormData } from './schema';

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
  login: (formData: LoginFormData) => Promise<void>;
}

type UseLoginStoreType = () => LoginStoreType;

/**
 * 移动端登录模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含登录功能
 * 表单验证由 react-hook-form 处理
 */
const useLoginStore: UseLoginStoreType = () => {
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
      console.log('Login form data:', formData);
      runInAction(() => {
        this.isLoading = true;
      });

      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000));
        runInAction(() => {
          this.isLoading = false;
        });
      } catch (error) {
        console.error('Login failed:', error);
        runInAction(() => {
          this.isLoading = false;
        });
        throw error;
      }
    },
  }));

  return store;
};

export default useLoginStore;
