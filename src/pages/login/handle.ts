import { Toast } from 'antd-mobile';
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
 * 处理忘记密码点击
 */
export const handleForgotPassword = (): void => {
  Toast.show({
    content: 'Navigate to forgot password page',
    position: 'bottom',
  });
  console.log('Navigate to forgot password page');
};

/**
 * Handle register click
 */
export const handleRegister = (): void => {
  Toast.show({
    content: 'Navigate to register page',
    position: 'bottom',
  });
  console.log('Navigate to register page');
};

/**
 * Handle user agreement click
 */
export const handleUserAgreement = (): void => {
  Toast.show({
    content: 'Open user agreement page',
    position: 'bottom',
  });
  console.log('Open user agreement page');
};

/**
 * Handle privacy policy click
 */
export const handlePrivacyPolicy = (): void => {
  Toast.show({
    content: 'Open privacy policy page',
    position: 'bottom',
  });
  console.log('Open privacy policy page');
};

/**
 * 模拟登录 API 请求
 * @param formData - 登录表单数据
 * @returns Promise<LoginApiResponse>
 */
export const mockLoginApi = async (
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
