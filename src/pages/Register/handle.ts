import type { RegisterFormData } from "./schema";

/**
 * 注册 API 响应类型
 */
export interface RegisterApiResponse {
  success: boolean; // 注册是否成功
  message: string;  // 响应消息
  token?: string;   // 登录令牌（注册成功自动登录）
}

/**
 * 模拟发送验证码 API
 * @param phone - 手机号码
 * @returns 是否发送成功
 */
export const sendVerifyCodeApi = async (phone: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`发送验证码到 ${phone}`);
      resolve(true);
    }, 1000);
  });
};

/**
 * 模拟注册 API
 * @param formData - 注册表单数据
 * @returns 注册响应数据
 */
export const registerApi = async (formData: RegisterFormData): Promise<RegisterApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("注册表单数据:", formData);
      resolve({
        success: true,
        message: "注册成功",
        token: `mock_token_${Date.now()}`
      });
    }, 1500);
  });
};

/**
 * 保存登录令牌
 * @param token - 登录令牌
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};
