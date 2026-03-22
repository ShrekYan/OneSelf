import type { ForgotPasswordFormData } from "./schema";

/**
 * 发送验证码 API 响应类型
 */
export interface SendCodeResponse {
  success: boolean;
  message: string;
}

/**
 * 提交忘记密码表单 API 响应类型
 */
export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * 模拟发送验证码 API
 * @param phone - 手机号码
 * @returns 发送验证码响应数据
 */
export const sendVerificationCode = async (phone: string): Promise<SendCodeResponse> => {
  console.log(phone);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "验证码已发送"
      });
    }, 1000);
  });
};

/**
 * 模拟提交忘记密码表单 API
 * @param formData - 忘记密码表单数据
 * @returns 提交响应数据
 */
export const submitForgotPassword = async (formData: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (formData.username && formData.email && formData.phone && formData.verificationCode) {
        resolve({
          success: true,
          message: "重置密码链接已发送"
        });
      } else {
        resolve({
          success: false,
          message: "提交失败"
        });
      }
    }, 1500);
  });
};

/**
 * 格式化验证码倒计时显示
 * @param seconds - 剩余秒数
 * @returns 格式化后的字符串
 */
export const formatCountdown = (seconds: number): string => {
  return `${seconds}秒后重新发送`;
};
