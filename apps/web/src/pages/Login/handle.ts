import { Toast } from 'antd-mobile';

/**
 * 处理忘记密码点击
 */
export const handleForgotPassword = (): void => {
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
