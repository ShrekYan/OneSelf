import { useLocalObservable } from 'mobx-react';
import type { ForgotPasswordFormData } from './schema';

/**
 * 忘记密码页面状态管理接口
 */
export interface ForgotPasswordStoreType {
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
  sendCode: (mobile: string) => Promise<boolean>;
  submitResetPassword: (data: ForgotPasswordFormData) => Promise<boolean>;
}

/**
 * 模拟发送验证码 API 请求
 * @param mobile - 手机号
 * @returns Promise<boolean>
 */
const mockSendCodeApi = async (mobile: string): Promise<boolean> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log('Mock send code API called with mobile:', mobile);
  // 保存到 localStorage 方便验证（mock 验证验证码为 123456）
  localStorage.setItem('forgotPasswordCode', '123456');
  localStorage.setItem('forgotPasswordMobile', mobile);

  // 默认返回成功
  return true;
};

/**
 * 模拟验证验证码 + 重置密码 API 请求
 * @param data - 完整表单数据
 * @returns Promise<boolean>
 */
const mockResetPasswordApi = async (
  data: ForgotPasswordFormData,
): Promise<boolean> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Mock reset password API called with data:', {
    mobile: data.mobile,
    code: data.code,
    passwordLength: data.password.length,
  });

  // 验证验证码（mock 验证码为 123456）
  const savedCode = localStorage.getItem('forgotPasswordCode');
  if (data.code !== savedCode) {
    return false;
  }

  // 清理 mock 数据
  localStorage.removeItem('forgotPasswordCode');
  localStorage.removeItem('forgotPasswordMobile');

  // 默认返回成功
  return true;
};

/**
 * 忘记密码模块状态管理 Hook
 * 使用 MobX 进行状态管理，单页表单
 * 表单验证由 react-hook-form 处理
 */
export const useForgotPasswordStore = () => {
  const store = useLocalObservable<ForgotPasswordStoreType>(() => ({
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

    /**
     * 提交重置密码请求（验证验证码 + 重置密码）
     * @param data - 完整表单数据（已通过验证）
     * @returns Promise<boolean>
     */
    async submitResetPassword(data: ForgotPasswordFormData) {
      this.isLoading = true;

      try {
        const result = await mockResetPasswordApi(data);
        this.isLoading = false;
        return result;
      } catch (error) {
        console.error('Reset password failed:', error);
        this.isLoading = false;
        throw error;
      }
    },
  }));

  return store;
};
