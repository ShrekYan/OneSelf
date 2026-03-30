import { useLocalObservable } from 'mobx-react';
import type { RegisterFormData } from './schema';

/**
 * 注册 API 响应类型
 */
export interface RegisterApiResponse {
  success: boolean;
  token?: string;
  message?: string;
}

/**
 * 注册页面状态管理接口
 */
export interface RegisterStoreType {
  // 状态数据
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  countdown: number;

  // Setter 方法
  setLoading: (loading: boolean) => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  setCountdown: (seconds: number) => void;
  startCountdown: () => void;

  // 业务方法
  register: (formData: RegisterFormData) => Promise<RegisterApiResponse>;
  sendCode: (mobile: string) => Promise<boolean>;
}

/**
 * 模拟注册 API 请求
 * @param formData - 注册表单数据
 * @returns Promise<RegisterApiResponse>
 */
const mockRegisterApi = async (
  formData: RegisterFormData,
): Promise<RegisterApiResponse> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800));

  // 这里可以添加模拟验证逻辑
  console.log('Mock register API called with:', formData);

  // 默认返回成功
  return {
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    message: 'Registration successful',
  };
};

/**
 * 模拟发送验证码 API 请求
 * @param mobile - 手机号
 * @returns Promise<boolean>
 */
const mockSendCodeApi = async (mobile: string): Promise<boolean> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('Mock send code API called with mobile:', mobile);

  // 默认返回成功
  return true;
};

/**
 * 移动端注册模块状态管理 Hook
 * 使用 MobX 进行状态管理，包含注册功能
 * 表单验证由 react-hook-form 处理
 */
export const useRegisterStore = () => {
  const store = useLocalObservable<RegisterStoreType>(() => ({
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    countdown: 0,

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
     * 切换确认密码可见性
     */
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    /**
     * 设置倒计时秒数
     * @param seconds - 秒数
     */
    setCountdown(seconds: number) {
      this.countdown = seconds;
    },

    /**
     * 开始倒计时
     */
    startCountdown() {
      this.countdown = 60;
      const timer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    },

    /**
     * 注册处理
     * @param formData - 表单数据（已通过验证）
     * @returns Promise
     */
    async register(formData: RegisterFormData) {
      this.isLoading = true;

      try {
        const result = await mockRegisterApi(formData);
        this.isLoading = false;
        return result;
      } catch (error) {
        console.error('Registration failed:', error);
        this.isLoading = false;
        throw error;
      }
    },

    /**
     * 发送验证码
     * @param mobile - 手机号
     * @returns Promise<boolean>
     */
    async sendCode(mobile: string) {
      this.isLoading = true;

      try {
        const result = await mockSendCodeApi(mobile);
        this.isLoading = false;
        if (result) {
          this.startCountdown();
        }
        return result;
      } catch (error) {
        console.error('Send code failed:', error);
        this.isLoading = false;
        throw error;
      }
    },
  }));

  return store;
};
