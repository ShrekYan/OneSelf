import type { LoginFormData } from "./schema";

/**
 * 登录 API 响应类型
 */
export interface LoginApiResponse {
  success: boolean; // 登录是否成功
  token: string;   // 登录令牌
}

/**
 * 模拟登录 API
 * @param formData - 登录表单数据
 * @returns 登录响应数据
 */
export const loginApi = async (formData: LoginFormData): Promise<LoginApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (formData.username && formData.password) {
        resolve({
          success: true,
          token: `mock_token_${Date.now()}`
        });
      } else {
        resolve({
          success: false,
          token: ""
        });
      }
    }, 1500);
  });
};

/**
 * 保存登录状态
 * 根据记住我选项保存用户名到本地存储
 * @param formData - 登录表单数据
 */
export const saveLoginState = (formData: LoginFormData): void => {
  if (formData.rememberMe) {
    localStorage.setItem("rememberedUsername", formData.username);
  } else {
    localStorage.removeItem("rememberedUsername");
  }
};

/**
 * 获取已记住的用户名
 * @returns 已保存的用户名，未保存返回空字符串
 */
export const getRememberedUsername = (): string => {
  return localStorage.getItem("rememberedUsername") || "";
};

/**
 * 保存登录令牌
 * @param token - 登录令牌
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};
