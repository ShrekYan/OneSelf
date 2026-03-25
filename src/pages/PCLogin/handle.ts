import type { LoginFormData } from './schema';

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean;
  token: string;
  message?: string;
}

/**
 * 登录 API
 * @param formData - 登录表单数据
 * @returns 登录响应数据
 */
export const loginApi = async (
  formData: LoginFormData,
): Promise<LoginApiResponse> => {
  // 实际项目中调用真正的 API
  return new Promise(resolve => {
    setTimeout(() => {
      if (formData.email && formData.password) {
        resolve({
          success: true,
          token: `mock_token_${Date.now()}`,
        });
      } else {
        resolve({
          success: false,
          token: '',
          message: '邮箱或密码不能为空',
        });
      }
    }, 1500);
  });
};

/**
 * 保存登录令牌
 * @param token - 登录令牌
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * 获取保存的令牌
 * @returns 保存的令牌
 */
export const getToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

/**
 * 处理 GitHub 第三方登录
 */
export const handleGithubLogin = (): void => {
  console.log('GitHub login clicked');
  window.location.href = '/api/auth/github';
};

/**
 * 处理 Twitter 第三方登录
 */
export const handleTwitterLogin = (): void => {
  console.log('Twitter login clicked');
  window.location.href = '/api/auth/twitter';
};

/**
 * 处理忘记密码
 */
export const handleForgotPassword = (): void => {
  console.log('Forgot password clicked');
  window.location.href = '/forgot-password';
};

/**
 * 处理注册跳转
 */
export const handleSignUp = (): void => {
  console.log('Sign up clicked');
  window.location.href = '/signup';
};
