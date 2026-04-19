import { Toast } from 'antd-mobile';

/**
 * 处理返回登录页
 */
export const handleGoToLogin = (): void => {
  Toast.show({
    content: 'Navigate to login page',
    position: 'bottom',
  });
  console.log('Navigate to login page');
};

/**
 * 格式化倒计时显示
 * @param seconds - 倒计时秒数
 * @returns 格式化显示文本
 */
export const formatCountdown = (seconds: number): string => {
  return `${seconds}s`;
};

/**
 * 验证手机号格式是否正确
 * @param mobile - 手机号
 * @returns 是否有效
 */
export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^1[3-9]\d{9}$/;
  return mobileRegex.test(mobile);
};
