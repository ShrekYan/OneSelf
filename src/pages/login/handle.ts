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
    content: '跳转到忘记密码页面',
    position: 'bottom',
  });
  console.log('Navigate to forgot password page');
};

/**
 * 处理注册点击
 */
export const handleRegister = (): void => {
  Toast.show({
    content: '跳转到注册页面',
    position: 'bottom',
  });
  console.log('Navigate to register page');
};

/**
 * 处理用户协议点击
 */
export const handleUserAgreement = (): void => {
  Toast.show({
    content: '打开用户协议页面',
    position: 'bottom',
  });
  console.log('Open user agreement page');
};

/**
 * 处理隐私政策点击
 */
export const handlePrivacyPolicy = (): void => {
  Toast.show({
    content: '打开隐私政策页面',
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
    message: '登录成功',
  };
};
