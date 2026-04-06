import { useLocalObservable } from 'mobx-react';
import type { Step2FormData, Step3FormData } from './schema';

/**
 * 忘记密码页面状态管理接口
 */
export interface ForgotPasswordStoreType {
  // 状态数据
  currentStep: 1 | 2 | 3;
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  countdown: number;
  mobile: string;

  // Setter 方法
  setCurrentStep: (step: 1 | 2 | 3) => void;
  setLoading: (loading: boolean) => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  setCountdown: (seconds: number) => void;
  setMobile: (mobile: string) => void;
  startCountdown: () => void;
  goToPrevStep: () => void;

  // 业务方法
  sendCode: (mobile: string) => Promise<boolean>;
  verifyCode: (data: Step2FormData) => Promise<boolean>;
  resetPassword: (data: Step3FormData) => Promise<boolean>;
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
 * 模拟验证验证码 API 请求
 * @param code - 验证码
 * @returns Promise<boolean>
 */
const mockVerifyCodeApi = async (code: string): Promise<boolean> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log('Mock verify code API called with code:', code);
  const savedCode = localStorage.getItem('forgotPasswordCode');

  return code === savedCode;
};

/**
 * 模拟重置密码 API 请求
 * @param password - 新密码
 * @returns Promise<boolean>
 */
const mockResetPasswordApi = async (password: string): Promise<boolean> => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Mock reset password API called with password:', password);

  // 清理 mock 数据
  localStorage.removeItem('forgotPasswordCode');
  localStorage.removeItem('forgotPasswordMobile');

  // 默认返回成功
  return true;
};

/**
 * 忘记密码模块状态管理 Hook
 * 使用 MobX 进行状态管理，分三步流程
 * 表单验证由 react-hook-form 处理
 */
export const useForgotPasswordStore = () => {
  const store = useLocalObservable<ForgotPasswordStoreType>(() => ({
    currentStep: 1,
    isLoading: false,
    showPassword: false,
    showConfirmPassword: false,
    countdown: 0,
    mobile: '',

    /**
     * 设置当前步骤
     * @param step - 步骤号
     */
    setCurrentStep(step: 1 | 2 | 3) {
      this.currentStep = step;
    },

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
     * 设置手机号
     * @param mobile - 手机号
     */
    setMobile(mobile: string) {
      this.mobile = mobile;
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
     * 返回到上一步
     */
    goToPrevStep() {
      if (this.currentStep === 2) {
        this.currentStep = 1;
      } else if (this.currentStep === 3) {
        this.currentStep = 2;
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
          this.setMobile(mobile);
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
     * 验证验证码，通过后进入下一步
     * @param data - 表单数据（已通过验证）
     * @returns Promise<boolean>
     */
    async verifyCode(data: Step2FormData) {
      this.isLoading = true;

      try {
        const result = await mockVerifyCodeApi(data.code);
        this.isLoading = false;
        if (result) {
          this.setCurrentStep(3);
        }
        return result;
      } catch (error) {
        console.error('Verify code failed:', error);
        this.isLoading = false;
        throw error;
      }
    },

    /**
     * 重置密码
     * @param data - 表单数据（已通过验证）
     * @returns Promise<boolean>
     */
    async resetPassword(data: Step3FormData) {
      this.isLoading = true;

      try {
        const result = await mockResetPasswordApi(data.password);
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
