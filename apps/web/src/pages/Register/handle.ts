import { Toast } from 'antd-mobile';

/**
 * 处理用户协议点击
 */
export const handleUserAgreement = (): void => {
  Toast.show({
    content: 'Open user agreement page',
    position: 'bottom',
  });
  console.log('Open user agreement page');
};

/**
 * 处理隐私政策点击
 */
export const handlePrivacyPolicy = (): void => {
  Toast.show({
    content: 'Open privacy policy page',
    position: 'bottom',
  });
  console.log('Open privacy policy page');
};

/**
 * 处理跳转到登录页
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
